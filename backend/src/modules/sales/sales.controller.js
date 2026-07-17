const Sale = require('./sales.model');
const Product = require('../products/product.model');
const User = require('../users/user.model');
const InventoryLog = require('../inventory/inventory.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

const generateReceiptNo = () =>
  `R${Date.now().toString(36)}${Math.floor(Math.random() * 46656)
    .toString(36)
    .padStart(3, '0')}`.toUpperCase();

exports.createSale = async (req, res) => {
  const cashierId = req.user?.id;
  if (!cashierId) return errorResponse(res, 'Not authorized', 401);
  const { items, paymentMethod, amountReceived, change, clientSaleId } = req.body;
  if (!items || items.length === 0) return errorResponse(res, 'No items in sale', 400);

  try {
    // Idempotency: offline devices retry queued sales, so a sale we already
    // processed must be acknowledged, not recorded twice.
    if (clientSaleId) {
      const existing = await Sale.findOne({ clientSaleId });
      if (existing) return successResponse(res, existing, 'Sale already processed', 200);
    }

    const cashier = await User.findById(cashierId).select('branchId').lean();
    const branchId = cashier?.branchId || null;

    let total = 0;
    const normalizedItems = [];
    const deducted = [];

    try {
      for (const item of items) {
        const qty = Number(item.quantity || 0);
        if (!item.productId || qty <= 0) continue;

        // Conditional atomic decrement: only succeeds if enough stock remains,
        // so concurrent sales cannot oversell.
        const product = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { returnDocument: 'after' },
        );
        if (!product) {
          const current = await Product.findById(item.productId).select('name stock').lean();
          if (!current) continue; // unknown product: skip, matching previous behavior
          const err = new Error(
            `Insufficient stock for "${current.name}". Available: ${Number(current.stock ?? 0)}`,
          );
          err.statusCode = 400;
          throw err;
        }
        deducted.push({ productId: product._id, qty, previousStock: Number(product.stock) + qty });

        // Always charge the server-side price; the client's price is not trusted.
        const price = Number(product.price ?? 0);
        total += price * qty;
        normalizedItems.push({
          productId: product._id,
          name: product.name,
          quantity: qty,
          price,
        });
      }

      if (normalizedItems.length === 0) {
        const err = new Error('No valid items in sale');
        err.statusCode = 400;
        throw err;
      }

      const pm = String(paymentMethod || 'cash').toLowerCase();
      const pmNormalized =
        pm === 'cash' ? 'Cash' : pm === 'card' ? 'Card' : pm === 'mobile' ? 'Mobile' : pm;

      const sale = new Sale({
        cashierId,
        branchId,
        items: normalizedItems,
        paymentMethod: pmNormalized,
        total,
        amountReceived: Number(amountReceived || 0),
        change: Number(change || 0),
        receiptNo: generateReceiptNo(),
        clientSaleId: clientSaleId || undefined,
        status: 'Completed',
      });
      const saved = await sale.save();

      // Log inventory movements only after the sale is committed, so logs never
      // reference a sale that was rolled back.
      for (const d of deducted) {
        await InventoryLog.create({
          productId: d.productId,
          changeType: 'Sale',
          quantity: d.qty,
          previousStock: d.previousStock,
          newStock: d.previousStock - d.qty,
          note: 'POS sale',
          performedBy: cashierId,
        });
      }

      return successResponse(res, saved, 'Sale processed successfully', 201);
    } catch (err) {
      // Restore any stock already deducted before the failure.
      await Promise.all(
        deducted.map((d) =>
          Product.updateOne({ _id: d.productId }, { $inc: { stock: d.qty } }),
        ),
      );

      // Two devices raced on the same clientSaleId: the other one won, return its sale.
      if (err?.code === 11000 && clientSaleId) {
        const existing = await Sale.findOne({ clientSaleId });
        if (existing) return successResponse(res, existing, 'Sale already processed', 200);
      }
      throw err;
    }
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
      .populate('cashierId', 'name email')
      .sort({ createdAt: -1 });
    return successResponse(res, sales);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getMySales = async (req, res) => {
  try {
    const sales = await Sale.find({ cashierId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    return successResponse(res, sales);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('cashierId', 'name')
      .populate('items.productId', 'name barcode');
    if (!sale) return errorResponse(res, 'Sale not found', 404);
    return successResponse(res, sale);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getSalesStats = async (req, res) => {
  try {
    const sales = await Sale.find({}).select('total items createdAt paymentMethod');
    const grossSales = sales.reduce((a, s) => a + Number(s.total || 0), 0);
    const transactions = sales.length;
    const productsSold = sales.reduce((a, s) => a + (s.items?.reduce((x, i) => x + Number(i.quantity || 0), 0) || 0), 0);
    return successResponse(res, { grossSales, transactions, productsSold });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

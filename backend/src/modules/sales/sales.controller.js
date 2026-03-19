const Sale = require('./sales.model');
const Product = require('../products/product.model');
const User = require('../users/user.model');
const InventoryLog = require('../inventory/inventory.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.createSale = async (req, res) => {
  const cashierId = req.user?.id;
  const cashier = await User.findById(cashierId).select('branchId').lean();
  const branchId = cashier?.branchId || null;
  const { items, paymentMethod, amountReceived, change } = req.body;
  if (!items || items.length === 0) return errorResponse(res, 'No items in sale', 400);
  if (!cashierId) return errorResponse(res, 'Not authorized', 401);

  try {
    let total = 0;
    const normalizedItems = [];
    const productUpdates = [];

    // First pass: validate stock
    for (const item of items) {
      const qty = Number(item.quantity || 0);
      if (!item.productId || qty <= 0) continue;
      const product = await Product.findById(item.productId);
      if (product) {
        const available = Number(product.stock ?? 0);
        if (available < qty) {
          return errorResponse(res, `Insufficient stock for "${product.name}". Available: ${available}`, 400);
        }
        productUpdates.push({ product, qty, item });
      }
    }

    // Second pass: deduct stock and build items
    for (const { product, qty, item } of productUpdates) {
      const price = Number(item.price ?? product.price ?? 0);
      total += price * qty;
      const previousStock = Number(product.stock ?? 0);
      product.stock -= qty;
      await product.save();

      await InventoryLog.create({
        productId: product._id,
        changeType: 'Sale',
        quantity: qty,
        previousStock,
        newStock: product.stock,
        note: 'POS sale',
        performedBy: cashierId,
      });

      normalizedItems.push({
        productId: product._id,
        name: product.name,
        quantity: qty,
        price,
      });
    }

    if (normalizedItems.length === 0) return errorResponse(res, 'No valid items in sale', 400);

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
      receiptNo: `R${Date.now().toString().slice(-6)}`,
      status: 'Completed',
    });
    const saved = await sale.save();
    return successResponse(res, saved, 'Sale processed successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
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

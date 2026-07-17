const InventoryLog = require('./inventory.model');
const Product = require('../products/product.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getInventory = async (req, res) => {
  try {
    const products = await Product.find({}).select('name barcode category stock unit updatedAt');
    return successResponse(res, products);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.adjustStock = async (req, res) => {
  const { productId, quantity, changeType, note } = req.body;
  const userId = req.user?.id;
  try {
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return errorResponse(res, 'Quantity must be a positive number', 400);
    }
    if (!['Restock', 'Adjustment', 'Damage'].includes(changeType)) {
      return errorResponse(res, 'Invalid change type', 400);
    }

    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, 'Product not found', 404);

    const previousStock = Number(product.stock ?? 0);
    const newStock =
      changeType === 'Restock'
        ? previousStock + qty
        : Math.max(0, previousStock - qty);
    product.stock = newStock;
    const savedProduct = await product.save();

    await InventoryLog.create({
      productId,
      changeType,
      quantity: Math.abs(newStock - previousStock),
      previousStock,
      newStock,
      note,
      performedBy: userId,
    });

    return successResponse(res, savedProduct, 'Stock adjusted successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/** Set absolute stock (mobile-friendly). Accepts productId, stock (new value), note */
exports.setStock = async (req, res) => {
  const { productId, stock, note } = req.body;
  const userId = req.user?.id;
  try {
    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, 'Product not found', 404);

    const previousStock = Number(product.stock ?? 0);
    const newStock = Math.max(0, Number(stock ?? 0));
    const delta = newStock - previousStock;
    product.stock = newStock;
    const savedProduct = await product.save();

    if (delta !== 0) {
      await InventoryLog.create({
        productId,
        changeType: delta > 0 ? 'Restock' : 'Adjustment',
        quantity: Math.abs(delta),
        previousStock,
        newStock,
        note: note || 'Stock update',
        performedBy: userId,
      });
    }

    return successResponse(res, savedProduct, 'Stock updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getInventoryHistory = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const [logs, total] = await Promise.all([
      InventoryLog.find({})
        .populate('productId', 'name barcode')
        .populate('performedBy', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      InventoryLog.countDocuments({}),
    ]);
    return res.json({
      success: true,
      message: 'Success',
      data: logs,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/** Valuation + alert summary for the back-office inventory dashboard. */
exports.getInventoryStats = async (req, res) => {
  try {
    const [agg] = await Product.aggregate([
      {
        $group: {
          _id: null,
          skus: { $sum: 1 },
          units: { $sum: { $ifNull: ['$stock', 0] } },
          costValue: { $sum: { $multiply: [{ $ifNull: ['$stock', 0] }, { $ifNull: ['$cost', 0] }] } },
          retailValue: { $sum: { $multiply: [{ $ifNull: ['$stock', 0] }, { $ifNull: ['$price', 0] }] } },
          outOfStock: { $sum: { $cond: [{ $lte: [{ $ifNull: ['$stock', 0] }, 0] }, 1, 0] } },
          lowStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $ifNull: ['$stock', 0] }, 0] },
                    { $lte: [{ $ifNull: ['$stock', 0] }, { $ifNull: ['$stockAlert', 5] }] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);
    const stats = agg || { skus: 0, units: 0, costValue: 0, retailValue: 0, outOfStock: 0, lowStock: 0 };
    delete stats._id;
    return successResponse(res, stats);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

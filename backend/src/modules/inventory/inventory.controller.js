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
  const { productId, quantity, changeType, note, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, 'Product not found', 404);

    const previousStock = product.stock;
    if (changeType === 'Restock') {
      product.stock += quantity;
    } else {
      product.stock -= quantity;
    }

    const savedProduct = await product.save();

    const log = new InventoryLog({
      productId,
      changeType,
      quantity,
      previousStock,
      newStock: savedProduct.stock,
      note,
      performedBy: userId
    });
    await log.save();

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
    const logs = await InventoryLog.find({})
      .populate('productId', 'name barcode')
      .populate('performedBy', 'name')
      .sort({ createdAt: -1 });
    return successResponse(res, logs);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const InventoryLog = require('./inventory.model');
const Product = require('../products/product.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

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

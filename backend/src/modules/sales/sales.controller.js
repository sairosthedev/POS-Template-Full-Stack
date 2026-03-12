const Sale = require('./sales.model');
const Product = require('../products/product.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.createSale = async (req, res) => {
  const { cashierId, items, paymentMethod } = req.body;
  if (!items || items.length === 0) return errorResponse(res, 'No items in sale', 400);

  try {
    let total = 0;
    // Process items and adjust stock
    for (const item of items) {
      total += item.price * item.quantity;
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const sale = new Sale({ cashierId, items, paymentMethod, total });
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

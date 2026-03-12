const Product = require('./product.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

/**
 * Get all products
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return successResponse(res, products);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/**
 * Create a product
 */
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    return successResponse(res, saved, 'Product created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Update a product
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, product, 'Product updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Delete a product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

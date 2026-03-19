const Product = require('./product.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

/**
 * Get all products (with optional pagination)
 * GET /products?page=1&limit=25 for pagination
 * GET /products returns all (for mobile/backwards compat)
 */
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    if (!isNaN(page) && page >= 1) {
      const perPage = isNaN(limit) || limit < 1 ? 25 : Math.min(limit, 100);
      const filterType = (req.query.filter || 'all').toLowerCase();
      const search = (req.query.search || req.query.q || '').trim();
      let queryFilter = {};
      if (filterType === 'low') {
        queryFilter = { $expr: { $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', { $ifNull: ['$stockAlert', 5] }] }] } };
      } else if (filterType === 'out') {
        queryFilter = { stock: 0 };
      }
      if (search) {
        const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const searchClause = { $or: [{ name: re }, { category: re }, { barcode: re }] };
        queryFilter = Object.keys(queryFilter).length
          ? { $and: [queryFilter, searchClause] }
          : searchClause;
      }
      const skip = (page - 1) * perPage;
      const [products, total, lowStockCount, outOfStockCount] = await Promise.all([
        Product.find(queryFilter).sort({ createdAt: -1 }).skip(skip).limit(perPage).lean(),
        Product.countDocuments(queryFilter),
        Product.countDocuments({ $expr: { $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', { $ifNull: ['$stockAlert', 5] }] }] } }),
        Product.countDocuments({ stock: 0 }),
      ]);
      return res.status(200).json({
        success: true,
        message: 'Success',
        data: products,
        pagination: { page, limit: perPage, total, totalPages: Math.ceil(total / perPage) },
        stats: { lowStock: lowStockCount, outOfStock: outOfStockCount },
      });
    }

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

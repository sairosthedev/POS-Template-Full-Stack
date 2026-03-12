const Category = require('./category.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return successResponse(res, categories);
  } catch (error) { return errorResponse(res, error.message); }
};

exports.createCategory = async (req, res) => {
  try {
    const cat = new Category(req.body);
    const saved = await cat.save();
    return successResponse(res, saved, 'Category created', 201);
  } catch (error) { return errorResponse(res, error.message, 400); }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Category deleted');
  } catch (error) { return errorResponse(res, error.message); }
};

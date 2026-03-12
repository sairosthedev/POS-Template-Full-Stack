const Expense = require('./expense.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({}).sort({ date: -1 });
    return successResponse(res, expenses);
  } catch (error) { return errorResponse(res, error.message); }
};

exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const saved = await expense.save();
    return successResponse(res, saved, 'Expense recorded', 201);
  } catch (error) { return errorResponse(res, error.message, 400); }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Expense deleted');
  } catch (error) { return errorResponse(res, error.message); }
};

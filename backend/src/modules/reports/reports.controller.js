const Sale = require('../sales/sales.model');
const Product = require('../products/product.model');
const User = require('../users/user.model');
const Branch = require('../branches/branch.model');
const Expense = require('../expenses/expense.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getDashboardStats = async (req, res) => {
  try {
    const [sales, productsCount, storesCount, employeesCount, expenses] = await Promise.all([
      Sale.find({}),
      Product.countDocuments(),
      Branch?.countDocuments() || Promise.resolve(0),
      User.countDocuments(),
      Expense?.find({}) || Promise.resolve([])
    ]);

    let grossSales = 0;
    let productsSold = 0;
    let totalExpenses = 0;

    expenses.forEach(e => { totalExpenses += e.amount; });
    sales.forEach(sale => {
      grossSales += sale.total;
      if (sale.items) {
        sale.items.forEach(item => { productsSold += item.quantity || 0; });
      }
    });

    const stats = {
      grossSales,
      productsSold,
      totalExpenses,
      grossProfit: grossSales - totalExpenses,
      transactions: sales.length,
      totalProducts: productsCount,
      totalStores: storesCount,
      totalEmployees: employeesCount
    };

    return successResponse(res, stats);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

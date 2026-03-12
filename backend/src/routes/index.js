const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const productRoutes = require('../modules/products/product.routes');
const salesRoutes = require('../modules/sales/sales.routes');
const reportRoutes = require('../modules/reports/reports.routes');
const branchRoutes = require('../modules/branches/branch.routes');
const expenseRoutes = require('../modules/expenses/expense.routes');
const settingsRoutes = require('../modules/settings/settings.routes');
const inventoryRoutes = require('../modules/inventory/inventory.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/sales', salesRoutes);
router.use('/reports', reportRoutes);
router.use('/branches', branchRoutes);
router.use('/expenses', expenseRoutes);
router.use('/settings', settingsRoutes);
router.use('/inventory', inventoryRoutes);

module.exports = router;

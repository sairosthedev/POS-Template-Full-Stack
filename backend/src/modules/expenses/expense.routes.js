const express = require('express');
const router = express.Router();
const expenseController = require('./expense.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);

router.get('/', authorizeRoles('Admin', 'Manager'), expenseController.getAllExpenses);
router.post('/', authorizeRoles('Admin', 'Manager'), expenseController.createExpense);
router.delete('/:id', authorizeRoles('Admin', 'Manager'), expenseController.deleteExpense);

module.exports = router;

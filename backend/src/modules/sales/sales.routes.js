const express = require('express');
const router = express.Router();
const salesController = require('./sales.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);

// POS cashier can create sales. Viewing sales is for Admin/Manager.
router.post('/', authorizeRoles('Admin', 'Manager', 'Cashier'), salesController.createSale);
router.get('/', authorizeRoles('Admin', 'Manager'), salesController.getAllSales);
router.get('/my', authorizeRoles('Cashier', 'Admin', 'Manager'), salesController.getMySales);
router.get('/stats', authorizeRoles('Admin', 'Manager'), salesController.getSalesStats);
router.get('/:id', authorizeRoles('Admin', 'Manager'), salesController.getSaleById);

module.exports = router;

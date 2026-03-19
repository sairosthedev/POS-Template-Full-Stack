const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);

router.get('/', authorizeRoles('Admin', 'Manager', 'Cashier'), inventoryController.getInventory);
router.get('/logs', authorizeRoles('Admin', 'Manager'), inventoryController.getInventoryHistory);
router.post('/adjust', authorizeRoles('Admin', 'Manager'), inventoryController.adjustStock);
router.post('/set', authorizeRoles('Admin', 'Manager'), inventoryController.setStock);
router.post('/update', authorizeRoles('Admin', 'Manager'), inventoryController.setStock);

module.exports = router;

const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);

// Inventory is admin/manager only
router.get('/logs', authorizeRoles('Admin', 'Manager'), inventoryController.getInventoryHistory);
router.post('/adjust', authorizeRoles('Admin', 'Manager'), inventoryController.adjustStock);

module.exports = router;

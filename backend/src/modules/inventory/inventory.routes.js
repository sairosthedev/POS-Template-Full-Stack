const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');

router.get('/logs', inventoryController.getInventoryHistory);
router.post('/adjust', inventoryController.adjustStock);

module.exports = router;

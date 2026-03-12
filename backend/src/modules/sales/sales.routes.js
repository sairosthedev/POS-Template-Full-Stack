const express = require('express');
const router = express.Router();
const salesController = require('./sales.controller');

router.get('/', salesController.getAllSales);
router.post('/', salesController.createSale);
router.get('/:id', salesController.getSaleById);

module.exports = router;

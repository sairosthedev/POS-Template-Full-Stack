const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');

router.get('/stats', reportsController.getDashboardStats);

module.exports = router;

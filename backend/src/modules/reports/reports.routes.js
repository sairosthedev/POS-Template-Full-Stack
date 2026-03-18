const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);
router.get('/stats', authorizeRoles('Admin', 'Manager'), reportsController.getDashboardStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const settingsController = require('./settings.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);
router.get('/', authorizeRoles('Admin'), settingsController.getSettings);
router.put('/', authorizeRoles('Admin'), settingsController.updateSettings);

module.exports = router;

const express = require('express');
const router = express.Router();
const settingsController = require('./settings.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);
// All roles can read (the POS needs store details for receipts); only Admin can change.
router.get('/', authorizeRoles('Admin', 'Manager', 'Cashier'), settingsController.getSettings);
router.put('/', authorizeRoles('Admin'), settingsController.updateSettings);

module.exports = router;

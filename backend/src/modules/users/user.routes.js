const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);

// Admin + Manager manage users
router.get('/', authorizeRoles('Admin', 'Manager'), userController.getAllUsers);
router.post('/', authorizeRoles('Admin', 'Manager'), userController.createUser);
router.put('/:id', authorizeRoles('Admin', 'Manager'), userController.updateUser);
router.delete('/:id', authorizeRoles('Admin', 'Manager'), userController.deleteUser);

module.exports = router;

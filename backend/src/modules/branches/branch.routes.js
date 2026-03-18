const express = require('express');
const router = express.Router();
const branchController = require('./branch.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);

router.get('/', authorizeRoles('Admin', 'Manager'), branchController.getAllBranches);
router.post('/', authorizeRoles('Admin'), branchController.createBranch);
router.put('/:id', authorizeRoles('Admin'), branchController.updateBranch);
router.delete('/:id', authorizeRoles('Admin'), branchController.deleteBranch);

module.exports = router;

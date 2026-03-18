const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const categoryController = require('./category.controller');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.use(protect);

// Everyone logged-in can view products (POS needs this)
router.get('/', productController.getAllProducts);
// Admin/Manager can manage products
router.post('/', authorizeRoles('Admin', 'Manager'), productController.createProduct);
router.put('/:id', authorizeRoles('Admin', 'Manager'), productController.updateProduct);
router.delete('/:id', authorizeRoles('Admin', 'Manager'), productController.deleteProduct);

// Category Routes
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', authorizeRoles('Admin', 'Manager'), categoryController.createCategory);
router.delete('/categories/:id', authorizeRoles('Admin', 'Manager'), categoryController.deleteCategory);

module.exports = router;

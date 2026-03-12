const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const categoryController = require('./category.controller');

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Category Routes
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', categoryController.createCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;

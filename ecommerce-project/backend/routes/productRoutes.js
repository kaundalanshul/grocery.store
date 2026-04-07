const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// GET /api/products/categories/list  — must be BEFORE /:id
router.get('/categories/list', getCategories);

// GET /api/products/category/:categoryName
router.get('/category/:categoryName', getProductsByCategory);

// GET /api/products  — all products (supports ?search= ?category= ?sort= ?page= ?limit=)
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products
router.post('/', createProduct);

// PUT /api/products/:id
router.put('/:id', updateProduct);

// DELETE /api/products/:id
router.delete('/:id', deleteProduct);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  getProductById
} = require('../controllers/productsController');

const authenticateToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin'); 

router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, isAdmin, createProduct);
router.put('/:id', authenticateToken, isAdmin, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router;

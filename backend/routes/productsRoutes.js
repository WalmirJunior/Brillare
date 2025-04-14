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

router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, createProduct); 
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);


module.exports = router;

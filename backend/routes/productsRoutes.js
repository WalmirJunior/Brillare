const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    updateProduct,
    deleteProduct,
    createProduct
  } = require('../controllers/productsController');
  
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, getAllProducts);
router.post('/', authenticateToken, createProduct); 
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);


module.exports = router;

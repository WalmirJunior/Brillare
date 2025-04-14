const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    updateProduct,
    deleteProduct
  } = require('../controllers/productsController');
  
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, getAllProducts);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);


module.exports = router;

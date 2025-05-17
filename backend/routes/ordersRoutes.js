const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  deleteUserOrder,
  deleteAnyOrder
} = require('../controllers/ordersController');

const authenticateToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/all', authenticateToken, isAdmin, getAllOrders); 
router.delete('/:orderId', authenticateToken, deleteUserOrder);
router.delete('/admin/:orderId', authenticateToken, isAdmin, deleteAnyOrder);

module.exports = router;

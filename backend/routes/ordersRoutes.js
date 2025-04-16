const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders
} = require('../controllers/ordersController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/all', authenticateToken, getAllOrders); 

module.exports = router;

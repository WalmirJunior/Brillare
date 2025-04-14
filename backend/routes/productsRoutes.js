const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/productsController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, getAllProducts);


module.exports = router;

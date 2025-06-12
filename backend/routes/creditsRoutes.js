const express = require('express');
const router = express.Router();
const { addCredits } = require('../controllers/creditsController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, addCredits);

module.exports = router;

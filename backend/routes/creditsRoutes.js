const express = require('express');
const router = express.Router();
const { addCredits, getCredits } = require('../controllers/creditsController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, addCredits);
router.get('/', authenticateToken, getCredits);

module.exports = router;

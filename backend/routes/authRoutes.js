const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { register } = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', register);

module.exports = router;

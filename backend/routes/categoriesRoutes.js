const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoriesController');

const authenticateToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', authenticateToken, getAllCategories);

router.post('/', authenticateToken, isAdmin, createCategory);
router.put('/:id', authenticateToken, isAdmin, updateCategory);
router.delete('/:id', authenticateToken, isAdmin, deleteCategory);

module.exports = router;

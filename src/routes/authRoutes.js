const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  listUsers,
  updateUser
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/users', authenticate, authorize('admin'), listUsers);
router.put('/users/:id', authenticate, authorize('admin'), updateUser);

module.exports = router;
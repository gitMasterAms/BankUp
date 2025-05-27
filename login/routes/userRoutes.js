const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/userController');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../utils/validators');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.patch('/reset-password/:token', resetPasswordValidation, resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
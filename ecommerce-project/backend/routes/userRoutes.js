const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile,
  getWishlist,
  toggleWishlist,
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getProfile);
router.get('/wishlist', verifyToken, getWishlist);
router.post('/wishlist/toggle', verifyToken, toggleWishlist);

module.exports = router;
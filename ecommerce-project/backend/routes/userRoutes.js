const express = require('express');
const { registerUser, loginUser, getProfile, toggleWishlist, getWishlist } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getProfile);

// Wishlist routes
router.post('/wishlist/toggle', verifyToken, toggleWishlist);
router.get('/wishlist', verifyToken, getWishlist);

module.exports = router;
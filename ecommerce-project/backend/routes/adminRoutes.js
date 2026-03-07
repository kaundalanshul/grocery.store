// Admin Routes for testing
const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

module.exports = router;
// Endpoints for admin dashboard, analytics, and management
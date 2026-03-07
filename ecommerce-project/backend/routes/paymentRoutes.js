// Payment Routes for testing
const express = require('express');
const router = express.Router();

router.post('/process', (req, res) => {
  res.json({ message: 'Payment processing' });
});

module.exports = router;
// Endpoints for payment processing, validation, and refunds
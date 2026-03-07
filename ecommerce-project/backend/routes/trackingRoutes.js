// Order Tracking Routes for testing
const express = require('express');
const router = express.Router();

router.get('/:orderId', (req, res) => {
  res.json({ message: 'Order tracking info' });
});

module.exports = router;
// Endpoints for real-time order status tracking
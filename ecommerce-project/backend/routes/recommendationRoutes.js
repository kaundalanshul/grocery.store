// Recommendation Routes for testing
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Recommendations fetched' });
});

module.exports = router;
// Endpoints for getting personalized product recommendations
// Chatbot Routes for testing
const express = require('express');
const router = express.Router();

router.post('/message', (req, res) => {
  res.json({ message: 'Chatbot responding' });
});

module.exports = router;
// Endpoints for chatbot messages and support interactions
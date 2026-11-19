const express = require('express');
const router = express.Router();
const {
  getChain,
  getStats,
  validateChain,
  getOrderProvenance,
  getBlockByIdentifier,
  minePendingTransactions,
  recordCustomTransaction,
} = require('../controllers/blockchainController');

// Blockchain Ledger Routes
router.get('/', getChain);
router.get('/stats', getStats);
router.get('/validate', validateChain);
router.get('/order/:orderId', getOrderProvenance);
router.get('/block/:identifier', getBlockByIdentifier);
router.post('/mine', minePendingTransactions);
router.post('/record', recordCustomTransaction);

module.exports = router;

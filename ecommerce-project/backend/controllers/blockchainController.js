const { blockchain } = require('../services/blockchainService');

/**
 * GET /api/blockchain
 * Retrieve the entire ledger chain
 */
const getChain = async (req, res) => {
  try {
    if (!blockchain.isInitialized) {
      await blockchain.init();
    }
    const validation = blockchain.isChainValid();

    return res.status(200).json({
      success: true,
      length: blockchain.chain.length,
      difficulty: blockchain.difficulty,
      isValid: validation.isValid,
      chain: blockchain.chain,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blockchain.',
      error: error.message,
    });
  }
};

/**
 * GET /api/blockchain/stats
 * Overview metrics of the blockchain
 */
const getStats = async (req, res) => {
  try {
    if (!blockchain.isInitialized) {
      await blockchain.init();
    }
    const stats = blockchain.getStats();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blockchain stats.',
      error: error.message,
    });
  }
};

/**
 * GET /api/blockchain/validate
 * Performs complete cryptographic audit on the chain
 */
const validateChain = async (req, res) => {
  try {
    if (!blockchain.isInitialized) {
      await blockchain.init();
    }
    const validation = blockchain.isChainValid();

    return res.status(200).json({
      success: true,
      ...validation,
      auditTimestamp: new Date().toISOString(),
      message: validation.isValid
        ? 'Blockchain is 100% verified and tamper-proof.'
        : 'Chain verification failed: possible data tampering.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Validation failed.',
      error: error.message,
    });
  }
};

/**
 * GET /api/blockchain/order/:orderId
 * Retrieve provenance history & verification certificate for an order
 */
const getOrderProvenance = async (req, res) => {
  try {
    if (!blockchain.isInitialized) {
      await blockchain.init();
    }
    const { orderId } = req.params;
    const verification = blockchain.verifyOrder(orderId);

    return res.status(200).json({
      success: true,
      ...verification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to verify order provenance on blockchain.',
      error: error.message,
    });
  }
};

/**
 * GET /api/blockchain/block/:identifier
 * Retrieve a specific block by index or hash
 */
const getBlockByIdentifier = async (req, res) => {
  try {
    if (!blockchain.isInitialized) {
      await blockchain.init();
    }
    const { identifier } = req.params;

    let targetBlock = null;

    if (!isNaN(identifier)) {
      const idx = parseInt(identifier, 10);
      targetBlock = blockchain.chain.find((b) => b.index === idx);
    } else {
      targetBlock = blockchain.chain.find((b) => b.hash === identifier);
    }

    if (!targetBlock) {
      return res.status(404).json({
        success: false,
        message: `Block '${identifier}' not found in blockchain.`,
      });
    }

    return res.status(200).json({
      success: true,
      block: targetBlock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve block.',
      error: error.message,
    });
  }
};

/**
 * POST /api/blockchain/mine
 * Mine any pending transactions into a new block
 */
const minePendingTransactions = async (req, res) => {
  try {
    if (!blockchain.isInitialized) {
      await blockchain.init();
    }
    const newBlock = await blockchain.minePendingTransactions();

    if (!newBlock) {
      return res.status(200).json({
        success: true,
        message: 'No pending transactions to mine.',
      });
    }

    return res.status(201).json({
      success: true,
      message: `Block #${newBlock.index} successfully mined and added to ledger.`,
      block: newBlock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mine transactions.',
      error: error.message,
    });
  }
};

/**
 * POST /api/blockchain/record
 * Record custom audit event or inventory checkpoint
 */
const recordCustomTransaction = async (req, res) => {
  try {
    if (!blockchain.isInitialized) {
      await blockchain.init();
    }
    const { type, payload, orderId } = req.body;

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Payload is required for custom blockchain record.',
      });
    }

    const txType = type || 'AUDIT_RECORD';
    blockchain.addTransaction(txType, orderId || null, payload);
    const minedBlock = await blockchain.minePendingTransactions();

    return res.status(201).json({
      success: true,
      message: 'Transaction recorded and mined into blockchain.',
      blockIndex: minedBlock.index,
      blockHash: minedBlock.hash,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record transaction.',
      error: error.message,
    });
  }
};

module.exports = {
  getChain,
  getStats,
  validateChain,
  getOrderProvenance,
  getBlockByIdentifier,
  minePendingTransactions,
  recordCustomTransaction,
};

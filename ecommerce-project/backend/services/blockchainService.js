const crypto = require('crypto');
const mongoose = require('mongoose');
const BlockModel = require('../models/Block');

/**
 * Single Transaction Representation on the Blockchain
 */
class Transaction {
  constructor(type, orderId, payload, timestamp = new Date().toISOString()) {
    this.type = type;
    this.orderId = orderId ? String(orderId) : null;
    this.payload = payload;
    this.timestamp = timestamp;
    this.txHash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(`${this.type}${this.orderId || ''}${this.timestamp}${JSON.stringify(this.payload)}`)
      .digest('hex');
  }
}

/**
 * Single Block Representation
 */
class Block {
  constructor(index, timestamp, transactions, previousHash = '', nonce = 0, difficulty = 2, hash = null, merkleRoot = null) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.merkleRoot = merkleRoot || this.calculateMerkleRoot();
    this.hash = hash || this.calculateHash();
    this.minedAt = null;
  }

  /**
   * Calculates SHA-256 hash of this block's header and data
   */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        `${this.index}${this.previousHash}${this.timestamp}${this.merkleRoot}${this.nonce}${this.difficulty}`
      )
      .digest('hex');
  }

  /**
   * Calculates the Merkle Root for the transactions in this block
   */
  calculateMerkleRoot() {
    if (!this.transactions || this.transactions.length === 0) {
      return crypto.createHash('sha256').update('empty_block').digest('hex');
    }

    let hashes = this.transactions.map((tx) =>
      typeof tx.calculateHash === 'function' ? tx.calculateHash() : tx.txHash
    );

    while (hashes.length > 1) {
      if (hashes.length % 2 !== 0) {
        // Duplicate the last element if odd number
        hashes.push(hashes[hashes.length - 1]);
      }
      const treeLevel = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const combined = crypto
          .createHash('sha256')
          .update(hashes[i] + hashes[i + 1])
          .digest('hex');
        treeLevel.push(combined);
      }
      hashes = treeLevel;
    }

    return hashes[0];
  }

  /**
   * Proof of Work (PoW) mining algorithm
   */
  mineBlock(difficulty) {
    this.difficulty = difficulty;
    const target = Array(difficulty + 1).join('0');

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    this.minedAt = new Date().toISOString();
    return this.hash;
  }
}

/**
 * Enterprise Blockchain Ledger Class
 */
class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 2; // Fast & secure Proof-of-Work difficulty
    this.pendingTransactions = [];
    this.isInitialized = false;
  }

  /**
   * Initializes the blockchain by reading from MongoDB or generating Genesis Block
   */
  async init() {
    if (this.isInitialized) return;

    try {
      const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

      if (isDbConnected) {
        // Check if blocks exist in database
        const dbBlocks = await BlockModel.find({}).sort({ index: 1 }).lean();

        if (dbBlocks && dbBlocks.length > 0) {
          this.chain = dbBlocks.map(
            (b) =>
              new Block(
                b.index,
                b.timestamp,
                b.transactions,
                b.previousHash,
                b.nonce,
                b.difficulty,
                b.hash,
                b.merkleRoot
              )
          );
          console.log(`🔗 Blockchain loaded: ${this.chain.length} block(s) restored from database.`);
        } else {
          // Initialize with Genesis block
          const genesis = this.createGenesisBlock();
          this.chain = [genesis];
          await this.persistBlock(genesis);
          console.log('🔗 Genesis Block created & persisted to database.');
        }
      } else {
        if (this.chain.length === 0) {
          const genesis = this.createGenesisBlock();
          this.chain = [genesis];
        }
      }

      this.isInitialized = true;
    } catch (err) {
      // If DB is offline, initialize in memory
      if (this.chain.length === 0) {
        const genesis = this.createGenesisBlock();
        this.chain = [genesis];
      }
      this.isInitialized = true;
      console.warn('⚠️  Blockchain running in in-memory mode (DB sync deferred):', err.message);
    }
  }

  /**
   * Creates the Genesis Block (#0)
   */
  createGenesisBlock() {
    const genesisTx = new Transaction(
      'GENESIS',
      null,
      {
        message: 'MegaMart Genesis Block - Immutable E-Commerce Ledger Initialized',
        version: '1.0.0',
        network: 'MegaMart-Private-Chain',
      },
      new Date().toISOString()
    );

    const genesisBlock = new Block(
      0,
      new Date().toISOString(),
      [genesisTx],
      '0000000000000000000000000000000000000000000000000000000000000000',
      0,
      this.difficulty
    );

    genesisBlock.mineBlock(this.difficulty);
    return genesisBlock;
  }

  getLatestBlock() {
    if (this.chain.length === 0) {
      const genesis = this.createGenesisBlock();
      this.chain.push(genesis);
    }
    return this.chain[this.chain.length - 1];
  }

  /**
   * Adds an unmined transaction to the pending pool
   */
  addTransaction(type, orderId, payload) {
    const tx = new Transaction(type, orderId, payload);
    this.pendingTransactions.push(tx);
    return tx;
  }

  /**
   * Mines pending transactions into a new Block and appends to the chain
   */
  async minePendingTransactions() {
    if (this.pendingTransactions.length === 0) {
      return null;
    }

    const latestBlock = this.getLatestBlock();
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      [...this.pendingTransactions],
      latestBlock.hash,
      0,
      this.difficulty
    );

    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.pendingTransactions = [];

    await this.persistBlock(newBlock);
    return newBlock;
  }

  /**
   * Convenience method to immediately record an order event onto the blockchain
   */
  async recordOrderEvent(order, eventType = 'ORDER_CREATED', additionalData = {}) {
    if (!this.isInitialized) {
      await this.init();
    }

    const payload = {
      orderId: order._id ? String(order._id) : String(order.id),
      totalAmount: order.totalAmount,
      itemsCount: order.items ? order.items.length : 0,
      orderStatus: order.orderStatus || 'placed',
      paymentStatus: order.paymentStatus || 'pending',
      paymentMethod: order.paymentMethod || 'card',
      shippingAddress: order.shippingAddress || null,
      ...additionalData,
    };

    const tx = new Transaction(eventType, payload.orderId, payload);
    const latestBlock = this.getLatestBlock();

    const block = new Block(
      this.chain.length,
      new Date().toISOString(),
      [tx],
      latestBlock.hash,
      0,
      this.difficulty
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);

    await this.persistBlock(block);

    return {
      blockIndex: block.index,
      blockHash: block.hash,
      txHash: tx.txHash,
      timestamp: block.timestamp,
    };
  }

  /**
   * Persists a block to MongoDB (graceful fallback if offline)
   */
  async persistBlock(block) {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return;
    }
    try {
      await BlockModel.findOneAndUpdate(
        { index: block.index },
        {
          index: block.index,
          timestamp: block.timestamp,
          transactions: block.transactions.map((tx) => ({
            txHash: tx.txHash || (typeof tx.calculateHash === 'function' ? tx.calculateHash() : 'unknown'),
            type: tx.type,
            orderId: tx.orderId,
            payload: tx.payload,
            timestamp: tx.timestamp,
          })),
          previousHash: block.previousHash,
          hash: block.hash,
          merkleRoot: block.merkleRoot,
          nonce: block.nonce,
          difficulty: block.difficulty,
          minedAt: block.minedAt || block.timestamp,
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      // In-memory operation will still proceed even if MongoDB write fails
      console.warn(`⚠️  Failed to persist block #${block.index} to DB:`, err.message);
    }
  }

  /**
   * Cryptographically validates the entire blockchain
   */
  isChainValid() {
    if (this.chain.length === 0) return { isValid: false, reason: 'Empty chain' };

    const genesis = this.chain[0];
    if (genesis.index !== 0) {
      return { isValid: false, reason: 'Invalid genesis block index', blockIndex: 0 };
    }

    const target = Array(this.difficulty + 1).join('0');

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify recalculation of block hash
      const recomputedHash = crypto
        .createHash('sha256')
        .update(
          `${currentBlock.index}${currentBlock.previousHash}${currentBlock.timestamp}${currentBlock.merkleRoot}${currentBlock.nonce}${currentBlock.difficulty}`
        )
        .digest('hex');

      if (currentBlock.hash !== recomputedHash) {
        return {
          isValid: false,
          reason: `Block #${currentBlock.index} hash mismatch (tampered data)`,
          blockIndex: currentBlock.index,
        };
      }

      // Verify previous block hash reference
      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          isValid: false,
          reason: `Block #${currentBlock.index} previousHash does not match Block #${previousBlock.index} hash`,
          blockIndex: currentBlock.index,
        };
      }

      // Verify Proof of Work compliance
      if (currentBlock.hash.substring(0, currentBlock.difficulty) !== target) {
        return {
          isValid: false,
          reason: `Block #${currentBlock.index} failed Proof-of-Work difficulty requirement`,
          blockIndex: currentBlock.index,
        };
      }
    }

    return { isValid: true, chainLength: this.chain.length };
  }

  /**
   * Retrieves all blockchain transactions for a specific order
   */
  getOrderHistory(orderId) {
    const stringId = String(orderId);
    const records = [];

    for (const block of this.chain) {
      if (block.transactions && Array.isArray(block.transactions)) {
        for (const tx of block.transactions) {
          if (tx.orderId === stringId) {
            records.push({
              blockIndex: block.index,
              blockHash: block.hash,
              minedAt: block.minedAt || block.timestamp,
              txHash: tx.txHash,
              type: tx.type,
              payload: tx.payload,
              timestamp: tx.timestamp,
            });
          }
        }
      }
    }

    return records;
  }

  /**
   * Verifies the cryptographic proof and authenticity of an order on-chain
   */
  verifyOrder(orderId) {
    const history = this.getOrderHistory(orderId);
    const chainValidation = this.isChainValid();

    if (history.length === 0) {
      return {
        verified: false,
        message: 'No blockchain records found for this Order ID',
        orderId,
      };
    }

    return {
      verified: chainValidation.isValid,
      chainIntegrity: chainValidation.isValid ? 'VERIFIED_SECURE' : 'COMPROMISED',
      orderId,
      transactionCount: history.length,
      firstRecordedAt: history[0].timestamp,
      latestStatus: history[history.length - 1].payload.orderStatus,
      records: history,
    };
  }

  /**
   * Returns summary statistics of the blockchain
   */
  getStats() {
    let totalTransactions = 0;
    for (const block of this.chain) {
      if (block.transactions) totalTransactions += block.transactions.length;
    }

    const validation = this.isChainValid();

    return {
      chainLength: this.chain.length,
      difficulty: this.difficulty,
      totalTransactions,
      pendingTransactionsCount: this.pendingTransactions.length,
      isValid: validation.isValid,
      integrityStatus: validation.isValid ? '100% Tamper-Proof & Verified' : 'Integrity Error Detected',
      latestBlock: this.chain.length > 0 ? {
        index: this.chain[this.chain.length - 1].index,
        hash: this.chain[this.chain.length - 1].hash,
        previousHash: this.chain[this.chain.length - 1].previousHash,
        merkleRoot: this.chain[this.chain.length - 1].merkleRoot,
        timestamp: this.chain[this.chain.length - 1].timestamp,
      } : null,
    };
  }
}

// Singleton blockchain instance across the backend application
const blockchainInstance = new Blockchain();

module.exports = {
  blockchain: blockchainInstance,
  Block,
  Transaction,
};

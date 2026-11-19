const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txHash: { type: String, required: true },
  type: {
    type: String,
    enum: ['GENESIS', 'ORDER_CREATED', 'ORDER_STATUS_UPDATED', 'PAYMENT_VERIFIED', 'AUDIT_RECORD', 'CUSTOM_TRANSACTION'],
    required: true,
  },
  orderId: { type: String },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: String, required: true },
}, { _id: false });

const blockSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true, unique: true },
    timestamp: { type: String, required: true },
    transactions: [transactionSchema],
    previousHash: { type: String, required: true },
    hash: { type: String, required: true, unique: true },
    merkleRoot: { type: String, required: true },
    nonce: { type: Number, required: true, default: 0 },
    difficulty: { type: Number, required: true, default: 2 },
    minedAt: { type: String },
  },
  { timestamps: true, bufferCommands: false }
);

module.exports = mongoose.model('Block', blockSchema);

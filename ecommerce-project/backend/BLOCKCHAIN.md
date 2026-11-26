 # Blockchain Ledger Architecture & API Reference

MegaMart backend includes a native, cryptographically secure **Proof-of-Work Blockchain Ledger** to guarantee tamper-proof audit trails, order integrity, and supply chain verification.

---

## 🛠️ Key Architectural Components

### 1. Cryptographic Hashing & Merkle Root
- **SHA-256 Engine**: Every block calculates its unique 256-bit cryptographic digest from its index, previous block hash, timestamp, Merkle root, nonce, and difficulty level.
- **Merkle Tree**: All transactions inside a block are hashed pairwise into a single Merkle root. Any modification to a transaction alters the root and breaks the block's hash.
- **Proof-of-Work (PoW)**: Adjustable mining difficulty (default target: `00...`). Miners solve a computational puzzle by incrementing a nonce until the cryptographic criteria are met.

### 2. MongoDB Persistence & In-Memory Fallback
- Blocks are persisted to the MongoDB `blocks` collection via [Block.js](file:///c:/Users/DELL/OneDrive/Desktop/grocery.store/ecommerce-project/backend/models/Block.js).
- When the backend boots, it verifies and loads the existing chain. If empty, the **Genesis Block (#0)** is generated and mined automatically.
- Operates resiliently in in-memory mode if the database connection is delayed or offline.

### 3. Automatic Order Lifecycle Integration
- **Order Placement**: Placing an order automatically generates an `ORDER_CREATED` transaction, mines a new block, and stores `blockchainTxHash` and `blockchainBlockIndex` directly on the order record.
- **Status Updates**: Updating order fulfillment (e.g. `placed` -> `shipped` -> `delivered`) records an `ORDER_STATUS_UPDATED` block with the status timestamp.

---

## 📡 REST API Endpoints

### 1. Get Entire Blockchain
- **Method**: `GET`
- **URL**: `/api/blockchain`
- **Response**:
```json
{
  "success": true,
  "length": 3,
  "difficulty": 2,
  "isValid": true,
  "chain": [
    {
      "index": 0,
      "timestamp": "2026-11-19T11:23:49.000Z",
      "transactions": [...],
      "previousHash": "0000000000000000000000000000000000000000000000000000000000000000",
      "hash": "00a214b4bb370cea991b1870c72327af7339d315e5909fe188ecfaeb3fc667e9",
      "merkleRoot": "...",
      "nonce": 128,
      "difficulty": 2
    }
  ]
}
```

### 2. Get Blockchain Statistics
- **Method**: `GET`
- **URL**: `/api/blockchain/stats`
- **Response**:
```json
{
  "success": true,
  "stats": {
    "chainLength": 3,
    "difficulty": 2,
    "totalTransactions": 3,
    "pendingTransactionsCount": 0,
    "isValid": true,
    "integrityStatus": "100% Tamper-Proof & Verified",
    "latestBlock": {
      "index": 2,
      "hash": "00153b135c4cd12ed215d4b89ec2cda07084432d30c58cfc0a7cc972d64a4326"
    }
  }
}
```

### 3. Verify Chain Integrity (Cryptographic Audit)
- **Method**: `GET`
- **URL**: `/api/blockchain/validate`
- **Response**:
```json
{
  "success": true,
  "isValid": true,
  "chainLength": 3,
  "auditTimestamp": "2026-11-19T11:24:00.000Z",
  "message": "Blockchain is 100% verified and tamper-proof."
}
```

### 4. Order Provenance & Verification Certificate
- **Method**: `GET`
- **URL**: `/api/blockchain/order/:orderId`
- **Response**:
```json
{
  "success": true,
  "verified": true,
  "chainIntegrity": "VERIFIED_SECURE",
  "orderId": "6758493021bcdef123456789",
  "transactionCount": 2,
  "firstRecordedAt": "2026-11-19T11:23:49.490Z",
  "latestStatus": "shipped",
  "records": [
    {
      "blockIndex": 1,
      "blockHash": "00f442381e718fd72c3920bd57ae167297e2c0ce93396f1eca6f34507ff81abc",
      "txHash": "1472225b01c16b791fd52f54873c449659ccd4db2ffb8357bbda27699887b8fd",
      "type": "ORDER_CREATED",
      "payload": { ... }
    }
  ]
}
```

### 5. Get Block by Index or Hash
- **Method**: `GET`
- **URL**: `/api/blockchain/block/:identifier` (e.g., `/api/blockchain/block/1` or `/api/blockchain/block/00f44238...`)

### 6. Record Custom Audit Transaction
- **Method**: `POST`
- **URL**: `/api/blockchain/record`
- **Body**:
```json
{
  "type": "AUDIT_RECORD",
  "orderId": "optional-order-id",
  "payload": {
    "action": "WAREHOUSE_INSPECTION",
    "inspector": "Admin",
    "notes": "Quality check passed"
  }
}
```

### 7. Mine Pending Transactions
- **Method**: `POST`
- **URL**: `/api/blockchain/mine`

---

## 🔒 Source Files
- **Service**: [blockchainService.js](file:///c:/Users/DELL/OneDrive/Desktop/grocery.store/ecommerce-project/backend/services/blockchainService.js)
- **Controller**: [blockchainController.js](file:///c:/Users/DELL/OneDrive/Desktop/grocery.store/ecommerce-project/backend/controllers/blockchainController.js)
- **Model**: [Block.js](file:///c:/Users/DELL/OneDrive/Desktop/grocery.store/ecommerce-project/backend/models/Block.js)
- **Routes**: [blockchainRoutes.js](file:///c:/Users/DELL/OneDrive/Desktop/grocery.store/ecommerce-project/backend/routes/blockchainRoutes.js)
- **Order Model**: [Order.js](file:///c:/Users/DELL/OneDrive/Desktop/grocery.store/ecommerce-project/backend/models/Order.js)
- **Order Controller**: [orderController.js](file:///c:/Users/DELL/OneDrive/Desktop/grocery.store/ecommerce-project/backend/controllers/orderController.js)

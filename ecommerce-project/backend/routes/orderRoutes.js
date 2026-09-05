const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', createOrder);                              // POST /api/orders
router.get('/my', verifyToken, getMyOrders);               // GET  /api/orders/my
router.get('/:id', getOrderById);                          // GET  /api/orders/:id
router.put('/:id/status', verifyToken, updateOrderStatus); // PUT  /api/orders/:id/status

module.exports = router;
const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, submitOrderPayment, cancelOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createOrder);                        // POST /api/orders
router.get('/my', verifyToken, getMyOrders);                       // GET  /api/orders/my
router.get('/:id', getOrderById);                                  // GET  /api/orders/:id
router.put('/:id/status', verifyToken, updateOrderStatus);         // PUT  /api/orders/:id/status
router.put('/:id/payment', verifyToken, submitOrderPayment);       // PUT  /api/orders/:id/payment
router.put('/:id/cancel', verifyToken, cancelOrder);                // PUT /api/orders/:id/cancel

module.exports = router;
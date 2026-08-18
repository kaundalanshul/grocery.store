const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, submitOrderPayment, cancelOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', createOrder);                                     // POST /api/orders (guest or logged-in)
router.get('/my', verifyToken, getMyOrders);                       // GET  /api/orders/my
router.get('/:id', getOrderById);                                  // GET  /api/orders/:id
router.put('/:id/status', verifyToken, updateOrderStatus);         // PUT  /api/orders/:id/status
router.put('/:id/payment', submitOrderPayment);                    // PUT  /api/orders/:id/payment (guest or logged-in)
router.put('/:id/cancel', verifyToken, cancelOrder);                // PUT /api/orders/:id/cancel

module.exports = router;
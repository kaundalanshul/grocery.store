const Order = require('../models/Order');

// POST /api/orders — place an order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, couponCode = '', discountAmount = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    // Safely get user id — may be ObjectId or string
    let userId = null;
    if (req.user && req.user.id) {
      const mongoose = require('mongoose');
      userId = mongoose.Types.ObjectId.isValid(req.user.id)
        ? req.user.id
        : null;
    }

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      discountAmount,
      couponCode,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('❌ Order creation error:', error.message, error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create order.' });
  }
};

// GET /api/orders/my — logged in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.', error: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image price');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch order.', error: error.message });
  }
};

// PUT /api/orders/:id/status — admin update
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update order.', error: error.message });
  }
};

// PUT /api/orders/:id/payment — submit payment confirmation reference
const submitOrderPayment = async (req, res) => {
  try {
    const { paymentReference } = req.body;
    if (!paymentReference) {
      return res.status(400).json({ success: false, message: 'Payment reference is required.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Update payment status to paid, save the UPI transaction reference in notes
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed'; // Automatically confirm since payment is received
    order.notes = `UPI Reference: ${paymentReference}`;
    await order.save();

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit payment reference.', error: error.message });
  }
};

// PUT /api/orders/:id/cancel — cancel an order before delivery
const cancelOrder = async (req, res) => {
  try {
    const { reason = 'Customer requested cancellation' } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (String(order.user) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own orders.' });
    }

    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'This order cannot be cancelled.' });
    }

    order.orderStatus = 'cancelled';
    order.paymentStatus = order.paymentStatus === 'paid' ? 'failed' : order.paymentStatus;
    order.cancellationReason = reason;
    order.cancelledAt = new Date();
    await order.save();

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to cancel order.', error: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, submitOrderPayment, cancelOrder };
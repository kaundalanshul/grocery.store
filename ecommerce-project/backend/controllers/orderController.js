const Order = require('../models/Order');

// POST /api/orders — place an order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    const order = await Order.create({
      user: req.user?.id || null,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create order.', error: error.message });
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

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus };
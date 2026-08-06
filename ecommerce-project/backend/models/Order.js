const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.Mixed },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: { type: String, default: 'card' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    trackingNumber: { type: String },
    notes: { type: String },
    cancellationReason: { type: String, default: '' },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
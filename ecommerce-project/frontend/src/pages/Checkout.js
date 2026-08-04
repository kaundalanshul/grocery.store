import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import { NavigationBar } from '../components/Home/NavigationBar';
import '../styles/checkout.css';

const FALLBACK = 'https://via.placeholder.com/80x80?text=No+Image';

const Checkout = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  
  // Checkout items can come from ProductDetails "Buy Now" state, or fallback to cart items
  const checkoutItems = location.state?.checkoutItems || cartItems;
  const isDirectBuy = !!location.state?.checkoutItems;
  
  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.name.trim() || !form.address.trim() || !form.city.trim() || !form.state.trim() || !form.zipCode.trim()) {
      setError('Please fill in all shipping fields.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const orderData = {
        items: checkoutItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
        shippingAddress: form,
        paymentMethod,
      };

      const response = await axios.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        if (!isDirectBuy) {
          clearCart();
        }
        
        const placedOrder = response.data.order;
        if (paymentMethod === 'upi') {
          navigate(`/payment?orderId=${placedOrder._id}`);
        } else {
          alert('Order placed successfully!');
          navigate('/order-tracking');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toFixed(2)}` : price;

  if (checkoutItems.length === 0) {
    return (
      <div className="page-wrapper">
        <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
        <div className="checkout-container">
          <div className="checkout-empty">
            <div className="empty-icon">🛒</div>
            <h2>Your checkout is empty</h2>
            <p>Please add products to your cart before proceeding.</p>
            <Link to="/products" className="shop-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
      <div className="checkout-container">
        <h1>Secure Checkout</h1>
        <div className="checkout-layout">
          {/* Left Column: Form & Payment */}
          <div className="checkout-form-section">
            <form onSubmit={handlePlaceOrder}>
              <div className="checkout-card">
                <h2>1. Shipping Address</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      placeholder="House number, street name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Bangalore"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Karnataka"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP / Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleInputChange}
                      placeholder="6 digits"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-card margin-top">
                <h2>2. Payment Method</h2>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <div className="option-info">
                      <span className="option-title">UPI QR Code Scanner</span>
                      <span className="option-desc">Scan using Google Pay, PhonePe, Paytm or any UPI App</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="option-info">
                      <span className="option-title">Credit / Debit Card</span>
                      <span className="option-desc">Pay securely with Visa, Mastercard, or Amex (Mocked)</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="option-info">
                      <span className="option-title">Cash on Delivery (COD)</span>
                      <span className="option-desc">Pay with cash when your package is delivered</span>
                    </div>
                  </label>
                </div>
              </div>
              
              {error && <div className="checkout-error-msg">{error}</div>}
              
              <button
                type="submit"
                className="checkout-submit-btn mobile-only-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : paymentMethod === 'upi' ? 'Proceed to UPI Payment ➔' : 'Place Order ⚡'}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-summary-section">
            <div className="checkout-card summary-card">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {checkoutItems.map((item) => (
                  <div key={item._id} className="summary-item">
                    <img
                      src={item.image || FALLBACK}
                      alt={item.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                    />
                    <div className="summary-item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <span className="summary-item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                className="checkout-submit-btn desktop-only-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : paymentMethod === 'upi' ? 'Proceed to UPI Payment ➔' : 'Place Order ⚡'}
              </button>
              
              <div className="back-links">
                <Link to="/cart">← Edit Cart</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
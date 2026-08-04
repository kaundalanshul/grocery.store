import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { NavigationBar } from '../components/Home/NavigationBar';
import '../styles/checkout.css';

const Payment = ({ theme, onToggleTheme }) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('Invalid Order Reference.');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`);
        if (data.success) {
          setOrder(data.order);
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!paymentRef.trim()) {
      alert('Please enter your 12-digit transaction ID (UTR).');
      return;
    }
    if (paymentRef.trim().length < 6) {
      alert('Please enter a valid reference ID.');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('authToken');
      
      const { data } = await axios.put(
        `/api/orders/${orderId}/payment`,
        { paymentReference: paymentRef.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success) {
        setPaymentSuccess(true);
      } else {
        alert(data.message || 'Payment confirmation failed.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit payment reference. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toFixed(2)}` : price;

  if (loading) {
    return (
      <div className="page-wrapper">
        <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
        <div className="checkout-container">
          <div className="checkout-loading">
            <div className="spinner" />
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-wrapper">
        <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
        <div className="checkout-container">
          <div className="checkout-empty">
            <div className="empty-icon">⚠️</div>
            <h2>Error Loading Payment Details</h2>
            <p>{error || 'Order could not be retrieved.'}</p>
            <Link to="/products" className="shop-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="page-wrapper">
        <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
        <div className="checkout-container">
          <div className="payment-success-card">
            <div className="success-icon">✓</div>
            <h2>Payment Details Received!</h2>
            <p className="success-subtitle">Order Reference: #{orderId.slice(-8).toUpperCase()}</p>
            <p className="success-message">
              Thank you for your payment. We will verify your transaction ID (<strong>{paymentRef}</strong>) and confirm your order shortly.
            </p>
            <div className="success-actions">
              <Link to="/order-tracking" className="track-btn">Track Your Order 📦</Link>
              <Link to="/products" className="continue-shopping-btn">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
      <div className="checkout-container">
        <h1>Complete UPI Payment</h1>
        <div className="payment-layout">
          {/* QR Code Section */}
          <div className="qr-section-card">
            <h2>Scan & Pay</h2>
            <p className="qr-helper-text">Scan this QR code using any UPI App (Google Pay, PhonePe, Paytm, BHIM, etc.)</p>
            <div className="qr-image-wrapper">
              <img
                src={`${process.env.PUBLIC_URL}/images/upi_qr.jpg`}
                alt="UPI Google Pay QR Scanner"
                className="upi-qr-image"
              />
            </div>
            <div className="payment-details-bar">
              <div className="payment-detail-item">
                <span className="label">Amount to Pay</span>
                <span className="value">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="payment-detail-item">
                <span className="label">UPI ID</span>
                <span className="value">megamart@upi</span>
              </div>
            </div>
          </div>

          {/* Verification Form Section */}
          <div className="verification-form-card">
            <h2>Verify Payment</h2>
            <p className="verification-helper">
              After completing the payment in your UPI app, please paste the 12-digit transaction reference ID/UTR below to confirm your order.
            </p>
            <form onSubmit={handleSubmitPayment} className="verification-form">
              <div className="form-group">
                <label htmlFor="utr">Transaction Reference ID (UTR / Ref No.)</label>
                <input
                  id="utr"
                  type="text"
                  placeholder="e.g. 123456789012"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  maxLength={24}
                  required
                />
              </div>
              <button
                type="submit"
                className="payment-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting UTR...' : 'Confirm Order & Submit ➔'}
              </button>
            </form>
            <div className="order-details-summary">
              <h3>Order Info</h3>
              <p><strong>Order ID:</strong> #{orderId.toUpperCase()}</p>
              <p><strong>Deliver To:</strong> {order.shippingAddress?.name}</p>
              <p><strong>Items:</strong> {order.items?.length} item(s)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
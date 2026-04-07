import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavigationBar } from '../components/Home/NavigationBar';
import { useCart } from '../context/CartContext';
import '../styles/home.css';
import '../App.css';

const FALLBACK = 'https://via.placeholder.com/80x80?text=No+Image';

const Cart = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price) =>
    typeof price === 'number' ? `$${price.toFixed(2)}` : price;

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
        <div className="cart-page">
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="cart-shop-btn">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
      <div className="cart-page">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button className="cart-clear-btn" onClick={clearCart}>Clear All</button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image || FALLBACK}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                  onClick={() => navigate(`/products/${item._id}`)}
                />
                <div className="cart-item-info">
                  <h3>
                    <Link to={`/products/${item._id}`} className="product-link">{item.name}</Link>
                  </h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item-subtotal">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item._id)}
                    title="Remove"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="cart-summary-free">FREE</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <button
              className="cart-checkout-btn"
              onClick={() => navigate('/order-tracking')}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="cart-continue-link">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (_) {
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener('auth-change', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('auth-change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🏠</span>
        <span className="bottom-nav-label">Home</span>
      </Link>

      <Link to="/products" className={`bottom-nav-item ${isActive('/products') ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🥬</span>
        <span className="bottom-nav-label">Shop</span>
      </Link>

      <Link to="/wishlist" className={`bottom-nav-item ${isActive('/wishlist') ? 'active' : ''}`}>
        <span className="bottom-nav-icon">❤️</span>
        <span className="bottom-nav-label">Wishlist</span>
      </Link>

      <Link to="/cart" className={`bottom-nav-item cart-item-nav ${isActive('/cart') ? 'active' : ''}`}>
        <div className="bottom-nav-icon-wrap">
          <span className="bottom-nav-icon">🛒</span>
          {cartCount > 0 && <span className="bottom-nav-badge">{cartCount}</span>}
        </div>
        <span className="bottom-nav-label">Cart</span>
      </Link>

      <Link
        to={user ? '/order-tracking' : '/login'}
        className={`bottom-nav-item ${isActive(user ? '/order-tracking' : '/login') ? 'active' : ''}`}
      >
        <span className="bottom-nav-icon">👤</span>
        <span className="bottom-nav-label">{user ? 'Orders' : 'Sign In'}</span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;

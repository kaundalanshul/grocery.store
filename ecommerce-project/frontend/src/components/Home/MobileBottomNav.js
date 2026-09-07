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
    <nav className="myntra-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Home */}
      <Link to="/" className={`myntra-nav-item ${isActive('/') ? 'active' : ''}`}>
        <span className="myntra-nav-logo-icon">🌿</span>
        <span className="myntra-nav-title">Home</span>
      </Link>

      {/* 2. fwd (Under ₹499) */}
      <Link
        to="/products?sort=price_asc"
        className={`myntra-nav-item fwd-item ${location.search.includes('price_asc') ? 'active' : ''}`}
      >
        <span className="myntra-fwd-word">fwd</span>
        <span className="myntra-nav-title">Under ₹499</span>
      </Link>

      {/* 3. LUXE (Categories) */}
      <Link
        to="/products"
        className={`myntra-nav-item luxe-item ${isActive('/products') && !location.search.includes('price_asc') ? 'active' : ''}`}
      >
        <span className="myntra-luxe-word">LUXE</span>
        <span className="myntra-nav-title">Categories</span>
      </Link>

      {/* 4. Bag / Cart */}
      <Link to="/cart" className={`myntra-nav-item bag-item ${isActive('/cart') ? 'active' : ''}`}>
        <div className="myntra-bag-icon-wrap">
          <span className="myntra-bag-icon">🛍️</span>
          {cartCount > 0 && <span className="myntra-bag-badge">{cartCount}</span>}
        </div>
        <span className="myntra-nav-title">Bag</span>
      </Link>

      {/* 5. Orders / Profile */}
      <Link
        to={user ? '/order-tracking' : '/login'}
        className={`myntra-nav-item ${isActive(user ? '/order-tracking' : '/login') ? 'active' : ''}`}
      >
        <span className="myntra-user-icon">👤</span>
        <span className="myntra-nav-title">{user ? 'Orders' : 'Profile'}</span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;

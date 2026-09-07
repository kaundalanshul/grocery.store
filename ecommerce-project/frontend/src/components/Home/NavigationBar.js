// Navigation Bar Component — Myntra-style Modern E-Commerce Header
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';

export const NavigationBar = ({ theme = 'light', onToggleTheme }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const wishlistCtx = useWishlist();
  const wishlistCount = wishlistCtx?.wishlist?.length || 0;
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  // Location selector state
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [city, setCity] = useState(localStorage.getItem('selectedCity') || 'Bangalore');

  const locationRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('authUser');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch (_) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const syncUser = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (_) {
        setUser(null);
      }
    };

    window.addEventListener('auth-change', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('auth-change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  // Outside click dismiss
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setShowUserMenu(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCitySelect = (cityName) => {
    setCity(cityName);
    localStorage.setItem('selectedCity', cityName);
    setShowLocationMenu(false);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'ALL') {
      navigate('/products');
    } else if (tabName === 'GROCERY') {
      navigate('/category/Grocery');
    } else if (tabName === 'MEN' || tabName === 'WOMEN' || tabName === 'KIDS') {
      navigate(`/category/Apparel?sub=${tabName.toLowerCase()}`);
    } else if (tabName === 'HOME') {
      navigate('/category/Furniture');
    }
  };

  return (
    <header className="myntra-header-wrapper">
      {/* ── 1. Top Bar: Mart Brand, Delivery Address & Wallet (Sabse Uper Search Bar Ke Upar) ── */}
      <div className="top-delivery-bar">
        {/* Mart Brand Name (Sabse Uper) */}
        <Link to="/" className="top-mart-brand" title="MegaMart Home">
          <span className="brand-logo-m">M</span>
          <div className="top-mart-title-wrap">
            <span className="top-mart-name">
              Mega<span className="top-mart-accent">Mart</span>
            </span>
            <span className="top-mart-sub">Superstore</span>
          </div>
        </Link>

        {/* Delivery Address Chip */}
        <div className="delivery-address-chip" ref={locationRef}>
          <span className="location-pin-icon">📍</span>
          <button
            type="button"
            className="delivery-address-btn"
            onClick={() => setShowLocationMenu(!showLocationMenu)}
            aria-label={`Deliver to: ${city}`}
          >
            <span className="deliver-to-text">Deliver to</span>
            <strong className="deliver-location-name">{city}, India</strong>
            <span className="dropdown-chevron">▾</span>
          </button>

          {showLocationMenu && (
            <div className="location-dropdown">
              <div className="location-dropdown-title">Select Delivery City</div>
              {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Nadaun, HP'].map((cityName) => (
                <button
                  type="button"
                  key={cityName}
                  className={cityName === city ? 'active' : ''}
                  onClick={() => handleCitySelect(cityName)}
                >
                  <span>{cityName}</span>
                  {cityName === city && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side wallet / coins badge */}
        <div className="top-wallet-chip" title="MegaMart Coins & Balance">
          <span className="wallet-amount">₹0</span>
          <span className="wallet-icon">💵</span>
        </div>
      </div>

      {/* ── 2. Search & App Actions Bar ── */}
      <div className="main-search-bar-row">
        <form className="myntra-search-pill" onSubmit={handleSearch}>
          <span className="search-input-icon" title="Search">🔍</span>

          <input
            type="text"
            placeholder='"Search clothes, groceries, essentials..."'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />

          {searchQuery && (
            <button
              type="button"
              className="search-clear-cross"
              onClick={() => setSearchQuery('')}
              title="Clear"
            >
              ✕
            </button>
          )}

          <div className="search-media-actions">
            <button type="button" className="media-btn" title="Voice Search" onClick={() => alert('Voice search activated! Say your product name.')}>
              🎙️
            </button>
            <button type="button" className="media-btn" title="Visual Lens Search" onClick={() => alert('Visual Lens search: Upload or point camera to search.')}>
              📷
            </button>
          </div>
        </form>

        <div className="header-icon-actions">
          {/* Theme Switcher */}
          <button
            className="hdr-icon-btn"
            onClick={onToggleTheme}
            title="Toggle theme"
            type="button"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Wishlist Link */}
          <Link to="/wishlist" className="hdr-icon-btn" title="Wishlist">
            ❤️
            {wishlistCount > 0 && <span className="hdr-badge">{wishlistCount}</span>}
          </Link>

          {/* User Profile / Menu */}
          {user ? (
            <div className="user-menu-wrap" ref={userMenuRef}>
              <button
                className="hdr-icon-btn profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title="Account"
                type="button"
              >
                👤
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email || ''}</small>
                  </div>
                  <Link to="/products" onClick={() => setShowUserMenu(false)}>{t('myProducts')}</Link>
                  <Link to="/order-tracking" onClick={() => setShowUserMenu(false)}>{t('myOrders')}</Link>
                  <button onClick={handleLogout} className="logout-btn">{t('signOut')}</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hdr-icon-btn" title="Sign In">
              👤
            </Link>
          )}

          {/* Cart Icon (Desktop view) */}
          <Link to="/cart" className="hdr-icon-btn desktop-cart-btn" title="Bag / Cart">
            🛍️
            {cartCount > 0 && <span className="hdr-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* ── 3. Department Tabs ── */}
      <nav className="department-tabs-bar" aria-label="Departments">
        <div className="department-tabs-scroll">
          {['ALL', 'MEN', 'WOMEN', 'KIDS', 'GROCERY', 'HOME'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`dept-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="dept-grid-menu-btn"
          onClick={() => navigate('/products')}
          title="All Categories"
        >
          🪟
        </button>
      </nav>
    </header>
  );
};

export default NavigationBar;
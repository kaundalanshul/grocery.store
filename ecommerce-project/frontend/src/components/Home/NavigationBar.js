// Navigation Bar Component — connected to CartContext, working search
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const NavigationBar = ({ theme = 'light', onToggleTheme }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);

  // BigBasket Style States
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [city, setCity] = useState(localStorage.getItem('selectedCity') || 'Bangalore');

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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="logo">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-dark)', fontWeight: '800', fontSize: '24px', letterSpacing: '-0.5px' }}>mega</span>
              <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '24px', letterSpacing: '-0.5px' }}>mart</span>
              <span style={{ fontSize: '20px' }}>🌿</span>
            </Link>
          </div>

          {/* Location Selector */}
          <div className="location-selector">
            <button type="button" className="location-btn" onClick={() => setShowLocationMenu(!showLocationMenu)}>
              📍 {city} ▾
            </button>
            {showLocationMenu && (
              <div className="location-dropdown">
                {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'].map((cityName) => (
                  <button type="button" key={cityName} onClick={() => handleCitySelect(cityName)}>
                    {cityName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <div className="navbar-actions">
          <button
            className="action-icon"
            title="Toggle theme"
            onClick={onToggleTheme}
            type="button"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="user-menu">
              <button
                className="action-icon user-name"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title="Account"
              >
                👤 <span className="nav-action-text">{user.name.split(' ')[0]}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/products" onClick={() => setShowUserMenu(false)}>{t('myProducts')}</Link>
                  <Link to="/order-tracking" onClick={() => setShowUserMenu(false)}>{t('myOrders')}</Link>
                  <button onClick={handleLogout}>{t('signOut')}</button>
                </div>
              )}
            </div>
          ) : (
            <Link className="action-icon" to="/login" title="Sign In">
              👤 <span className="nav-action-text">{t('signIn')}</span>
            </Link>
          )}

          <Link className="action-icon cart" to="/cart" title="Cart">
            🛒{' '}
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          <Link className="action-icon" to="/wishlist" title="Wishlist">
            ❤️
          </Link>
        </div>
      </div>

      <div className="secondary-nav">
        <ul className="nav-links">
          <li><Link to="/">{t('home')}</Link></li>
          <li><Link to="/products">{t('allProducts')}</Link></li>
          <li><Link to="/category/Grocery">{t('grocery')}</Link></li>
          <li><Link to="/category/Apparel">{t('apparel')}</Link></li>
          <li><Link to="/category/Shoes">{t('shoes')}</Link></li>
          <li><Link to="/category/Furniture">{t('furniture')}</Link></li>
          <li><Link to="/category/Books">{t('books')}</Link></li>
          <li><Link to="/category/Sports">{t('sports')}</Link></li>
          <li><Link to="/cart">{t('cart')} {cartCount > 0 && `(${cartCount})`}</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
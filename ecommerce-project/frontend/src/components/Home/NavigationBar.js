// Navigation Bar Component — connected to CartContext, working search
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const NavigationBar = ({ theme = 'light', onToggleTheme }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = useMemo(() => {
    try {
      const storedUser = localStorage.getItem('authUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (_) { return null; }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>ShopAnon</h1>
          </Link>
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
                👤 {user.name.split(' ')[0]}
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
              👤 {t('signIn')}
            </Link>
          )}

          <Link className="action-icon cart" to="/cart" title="Cart">
            🛒{' '}
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <div className="secondary-nav">
        <ul className="nav-links">
          <li><Link to="/">{t('home')}</Link></li>
          <li><Link to="/products">{t('allProducts')}</Link></li>
          <li><Link to="/category/Men's">{t('mens')}</Link></li>
          <li><Link to="/category/Women's">{t('womens')}</Link></li>
          <li><Link to="/category/Jewelry">{t('jewelry')}</Link></li>
          <li><Link to="/category/Footwear">{t('footwear')}</Link></li>
          <li><Link to="/category/Accessories">{t('accessories')}</Link></li>
          <li><Link to="/cart">{t('cart')} {cartCount > 0 && `(${cartCount})`}</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
// Navigation Bar Component — Myntra-style Modern E-Commerce Header with Amazon-grade Search
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { products as fallbackProducts } from '../../data/products';

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

  // Amazon Autocomplete & Search Suggestions state
  const [suggestions, setSuggestions] = useState({ suggestions: [], products: [], categories: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Location selector state
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [city, setCity] = useState(localStorage.getItem('selectedCity') || 'Bangalore');

  const locationRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Fetch Amazon-style suggestions with 180ms debouncing
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions({ suggestions: [], products: [], categories: [] });
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get('/api/products/search/suggestions', {
          params: { q },
        });
        if (data && data.success) {
          setSuggestions({
            suggestions: data.suggestions || [],
            products: data.products || [],
            categories: data.categories || [],
          });
        }
      } catch (err) {
        // Instant local fallback suggestions if backend is busy or offline
        const lowerQ = q.toLowerCase();
        const tokens = lowerQ.split(/\s+/).filter(Boolean);
        const matchedProducts = (fallbackProducts || []).filter((p) => {
          const s = `${p.name} ${p.brand || ''} ${p.category} ${p.subcategory || ''} ${(p.keywords || []).join(' ')} ${p.description || ''}`.toLowerCase();
          return tokens.every((tok) => s.includes(tok));
        }).slice(0, 4);

        const textSuggestions = Array.from(new Set(matchedProducts.map((p) => p.name)))
          .slice(0, 5)
          .map((text) => ({ text, type: 'query' }));

        const catMatches = Array.from(new Set(matchedProducts.map((p) => p.category))).slice(0, 3);
        catMatches.forEach((cat) => {
          textSuggestions.push({ text: `${q} in ${cat}`, category: cat, type: 'category_scope' });
        });

        setSuggestions({
          suggestions: textSuggestions,
          products: matchedProducts,
          categories: catMatches,
        });
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Flattened navigable items for keyboard controls
  const allNavItems = useMemo(() => {
    const items = [];
    (suggestions.suggestions || []).forEach((s) => {
      items.push({ kind: 'suggestion', ...s });
    });
    (suggestions.products || []).forEach((p) => {
      items.push({ kind: 'product', ...p });
    });
    return items;
  }, [suggestions]);

  const selectItem = useCallback((item) => {
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    if (!item) return;

    if (item.kind === 'product' || item._id) {
      navigate(`/products/${item._id}`);
    } else if (item.category && item.type === 'category_scope') {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(item.category)}`);
    } else if (item.text) {
      navigate(`/products?search=${encodeURIComponent(item.text)}`);
    }
  }, [navigate, searchQuery]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || allNavItems.length === 0) {
      if (e.key === 'ArrowDown' && searchQuery.trim().length > 0) {
        setShowSuggestions(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % allNavItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev <= 0 ? allNavItems.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < allNavItems.length) {
        e.preventDefault();
        selectItem(allNavItems[activeSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setShowUserMenu(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const cleanQ = query.trim();
    if (!cleanQ) return text;
    try {
      const parts = text.split(new RegExp(`(${cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === cleanQ.toLowerCase() ? (
          <strong key={i} className="suggestion-matched-bold">{part}</strong>
        ) : (
          part
        )
      );
    } catch (_) {
      return text;
    }
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toFixed(2)}` : price;

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
        <div className="search-bar-container" ref={searchContainerRef}>
          <form className="myntra-search-pill" onSubmit={handleSearch}>
            <span className="search-input-icon" title="Search">🔍</span>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products, brands, groceries..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onKeyDown={handleKeyDown}
              aria-label="Search products"
              autoComplete="off"
            />

            {searchQuery && (
              <button
                type="button"
                className="search-clear-cross"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions({ suggestions: [], products: [], categories: [] });
                  setShowSuggestions(false);
                  if (searchInputRef.current) searchInputRef.current.focus();
                }}
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

          {/* Amazon-style Autocomplete Dropdown */}
          {showSuggestions && searchQuery.trim().length > 0 && (
            <div className="amazon-suggestions-dropdown" role="listbox">
              {isLoadingSuggestions && (
                <div className="suggestion-loading-bar">
                  <span className="suggestion-loading-dot" />
                  Searching MegaMart...
                </div>
              )}

              {/* Suggestions or Products Available */}
              {(suggestions.suggestions?.length > 0 || suggestions.products?.length > 0) ? (
                <>
                  {/* Keyword / Category Suggestions */}
                  {suggestions.suggestions?.length > 0 && (
                    <div className="suggestion-section">
                      <div className="suggestion-section-title">SUGGESTIONS</div>
                      {suggestions.suggestions.map((s, idx) => {
                        const isNavActive = activeSuggestionIndex === idx;
                        return (
                          <div
                            key={`sug-${idx}`}
                            className={`amazon-suggestion-item ${isNavActive ? 'nav-active' : ''}`}
                            onClick={() => selectItem({ kind: 'suggestion', ...s })}
                            onMouseEnter={() => setActiveSuggestionIndex(idx)}
                          >
                            <span className="suggestion-icon">
                              {s.type === 'category_scope' ? '📂' : '🔍'}
                            </span>
                            <span className="suggestion-label">
                              {s.type === 'category_scope' ? (
                                <>
                                  <span className="scope-keyword">{searchQuery}</span>
                                  <span className="scope-in-cat"> in <strong>{s.category}</strong></span>
                                </>
                              ) : (
                                highlightMatch(s.text, searchQuery)
                              )}
                            </span>
                            {s.type === 'category_scope' && (
                              <span className="suggestion-cat-badge">{s.category}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Matching Products Quick Preview Cards */}
                  {suggestions.products?.length > 0 && (
                    <div className="suggestion-section products-preview-section">
                      <div className="suggestion-section-title">MATCHING PRODUCTS</div>
                      <div className="suggestion-products-grid">
                        {suggestions.products.map((prod, pIdx) => {
                          const navIdx = (suggestions.suggestions?.length || 0) + pIdx;
                          const isNavActive = activeSuggestionIndex === navIdx;
                          return (
                            <div
                              key={`prod-${prod._id || pIdx}`}
                              className={`suggestion-product-card ${isNavActive ? 'nav-active' : ''}`}
                              onClick={() => selectItem({ kind: 'product', ...prod })}
                              onMouseEnter={() => setActiveSuggestionIndex(navIdx)}
                            >
                              <img
                                src={prod.image || 'https://via.placeholder.com/60x60?text=Item'}
                                alt={prod.name}
                                className="suggestion-prod-img"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=Item'; }}
                              />
                              <div className="suggestion-prod-info">
                                <span className="suggestion-prod-title">{prod.name}</span>
                                <div className="suggestion-prod-meta">
                                  <span className="suggestion-prod-price">{formatPrice(prod.price)}</span>
                                  {prod.category && (
                                    <span className="suggestion-prod-dept">{prod.category}</span>
                                  )}
                                  {prod.brand && (
                                    <span className="suggestion-prod-brand">{prod.brand}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bottom "View all results" shortcut */}
                  <div
                    className="suggestion-bottom-bar"
                    onClick={() => handleSearch()}
                  >
                    <span>View all results for <strong>"{searchQuery}"</strong></span>
                    <span className="suggestion-arrow">→</span>
                  </div>
                </>
              ) : (
                !isLoadingSuggestions && (
                  <div className="suggestion-no-match">
                    <p className="no-sug-title">No suggestions found for "{searchQuery}"</p>
                    <button
                      type="button"
                      className="suggestion-search-anyway-btn"
                      onClick={() => handleSearch()}
                    >
                      Search all departments for "{searchQuery}"
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

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
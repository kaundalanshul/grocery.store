// Navigation Bar Component
// Main header with logo, search, and action buttons

import React, { useState } from 'react';

export const NavigationBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <h1>Anon</h1>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Enter your product name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <button className="action-icon" title="Account">👤 SIGN IN</button>
          <button className="action-icon wishlist" title="Wishlist">
            ❤️ <span className="badge">{wishlistCount}</span>
          </button>
          <button className="action-icon cart" title="Cart">
            🛒 <span className="badge">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="secondary-nav">
        <ul className="nav-links">
          <li><a href="/">HOME</a></li>
          <li><a href="/categories">CATEGORIES</a></li>
          <li><a href="/mens">MEN'S</a></li>
          <li><a href="/womens">WOMEN'S</a></li>
          <li><a href="/jewelry">JEWELRY</a></li>
          <li><a href="/featured">FEATURED</a></li>
          <li><a href="/blog">BLOG</a></li>
          <li><a href="/contact">GET OFFER</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
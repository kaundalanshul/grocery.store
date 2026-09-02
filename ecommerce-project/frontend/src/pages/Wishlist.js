import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { NavigationBar } from '../components/Home/NavigationBar';
import '../styles/home.css';
import '../App.css';
import '../styles/wishlist.css';

const Wishlist = ({ theme, onToggleTheme }) => {
  const { wishlist, loading, toggleWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="page-wrapper">
        <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
        <div className="wishlist-page">
          <div className="wishlist-loading">
            <div className="spinner"></div>
            <p>Loading your wishlist…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <h1>❤️ My Wishlist</h1>
            <p className="wishlist-subtitle">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
          </div>

          {wishlist.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">🤍</div>
              <h2>Your wishlist is empty</h2>
              <p>Save items you love — they'll appear here for easy access.</p>
              <Link to="/products" className="wishlist-shop-btn">
                Discover Products
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((product) => {
                const isPopulated = typeof product === 'object' && product._id;
                const id = isPopulated ? product._id : product;
                const name = isPopulated ? product.name : 'Loading…';
                const price = isPopulated ? product.price : 0;
                const image = isPopulated ? product.image : '';

                return (
                  <div key={id} className="wishlist-card">
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => toggleWishlist(id)}
                      title="Remove from wishlist"
                    >
                      ❤️
                    </button>
                    {isPopulated && (
                      <Link to={`/products/${id}`} className="wishlist-card-img-wrap">
                        <img
                          src={image || 'https://via.placeholder.com/300x300?text=No+Image'}
                          alt={name}
                          className="wishlist-card-img"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                        />
                      </Link>
                    )}
                    <div className="wishlist-card-info">
                      <Link to={`/products/${id}`} className="wishlist-card-title-link">
                        <h3 className="wishlist-card-title">{name}</h3>
                      </Link>
                      {isPopulated && (
                        <div className="wishlist-card-price">
                          ₹{typeof price === 'number' ? price.toFixed(2) : price}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link className="auth-back-link" to="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

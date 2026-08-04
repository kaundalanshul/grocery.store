import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { NavigationBar } from '../components/Home/NavigationBar';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/home.css';
import '../App.css';

const FALLBACK = 'https://via.placeholder.com/300x300?text=No+Image';

const Products = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [addedId, setAddedId] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (sortBy) params.sort = sortBy;
      const { data } = await axios.get('/api/products', { params });
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toFixed(2)}` : price;

  return (
    <div className="page-wrapper">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
      <div className="products-page">
        <div className="products-header">
          <h1>All Products</h1>
          <p>Browse our full collection and add items to your cart instantly.</p>
        </div>

        {/* Controls */}
        <div className="products-controls">
          <form onSubmit={handleSearch} className="products-search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="products-search-input"
            />
            <button type="submit" className="products-search-btn">🔍 Search</button>
            {search && (
              <button
                type="button"
                className="products-clear-btn"
                onClick={() => { setSearch(''); setSearchInput(''); }}
              >
                ✕ Clear
              </button>
            )}
          </form>
          <select
            className="products-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Best Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {search && (
          <p className="products-result-info">
            Showing results for: <strong>"{search}"</strong> — {products.length} item(s) found
          </p>
        )}

        {/* States */}
        {loading && (
          <div className="products-loading">
            <div className="spinner" />
            <p>Loading products...</p>
          </div>
        )}
        {error && !loading && (
          <div className="products-error">
            <p>⚠️ {error}</p>
            <button onClick={fetchProducts} className="products-view-btn">Retry</button>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="products-empty">
            <p>😕 No products found.</p>
            <Link to="/" className="products-view-btn">Back to Home</Link>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="products-list-grid">
            {products.map((product) => (
              <article key={product._id} className="products-list-card" style={{ position: 'relative' }}>
                <button 
                  onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                  style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                    background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {isInWishlist(product._id) ? '❤️' : '🤍'}
                </button>
                <div
                  className="products-list-image-wrap"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <img
                    src={product.image || FALLBACK}
                    alt={product.name}
                    className="products-list-image"
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                  />
                  {product.discount && (
                    <span className="products-badge">{product.discount}</span>
                  )}
                </div>
                <div className="products-list-content">
                  <p className="products-category">{product.category}</p>
                  <h3>
                    <Link className="product-link" to={`/products/${product._id}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <div className="products-rating">
                    <span className="stars">★</span> {product.rating}
                    <span className="sold-count"> · {product.sold} sold</span>
                  </div>
                  <div className="products-pricing">
                    <span className="products-current">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="products-original">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="products-actions">
                    <Link className="products-view-btn" to={`/products/${product._id}`}>
                      View
                    </Link>
                    <button
                      className={`products-cart-btn${addedId === product._id ? ' added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedId === product._id ? '✓ Added!' : '🛒 Add'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { NavigationBar } from '../components/Home/NavigationBar';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products as fallbackProducts } from '../data/products';
import '../styles/home.css';
import '../App.css';

const FALLBACK = 'https://via.placeholder.com/300x300?text=No+Image';
const INITIAL_PRODUCTS = (fallbackProducts || []).map((product) => ({
  ...product,
  _id: product._id || product.id,
}));

const Products = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [addedId, setAddedId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [compareIds, setCompareIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('compareProducts') || '[]');
    } catch (_) {
      return [];
    }
  });
  const [showCompare, setShowCompare] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    if (query) {
      setSearchInput(query);
      setSearch(query);
    }
  }, [location.search]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (sortBy) params.sort = sortBy;
      params.limit = 200;
      const { data } = await axios.get('/api/products', { params });
      const fetchedProducts = Array.isArray(data.products) && data.products.length > 0
        ? data.products.map((product) => ({ ...product, _id: product._id || product.id }))
        : INITIAL_PRODUCTS;
      setProducts(fetchedProducts);
    } catch (err) {
      setProducts(INITIAL_PRODUCTS);
      setError('');
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

  const toggleCompare = (productId) => {
    setCompareIds((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId].slice(0, 3);
      localStorage.setItem('compareProducts', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem('compareProducts', JSON.stringify(compareIds));
  }, [compareIds]);

  const filteredProducts = useMemo(() => {
    let next = [...products];

    if (categoryFilter !== 'all') {
      next = next.filter((product) => product.category === categoryFilter);
    }

    if (availabilityFilter === 'in-stock') {
      next = next.filter((product) => Number(product.stock || 0) > 0);
    }

    if (availabilityFilter === 'out-of-stock') {
      next = next.filter((product) => Number(product.stock || 0) <= 0);
    }

    if (featuredFilter === 'featured') {
      next = next.filter((product) => product.featured);
    }

    if (featuredFilter === 'new') {
      next = next.filter((product) => product.isNew);
    }

    return next;
  }, [products, categoryFilter, availabilityFilter, featuredFilter]);

  const compareProducts = useMemo(
    () => products.filter((product) => compareIds.includes(product._id)),
    [products, compareIds]
  );

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

        <div className="products-filter-row">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Grocery">Grocery</option>
            <option value="Apparel">Apparel</option>
            <option value="Shoes">Shoes</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
            <option value="Furniture">Furniture</option>
            <option value="Stationery">Stationery</option>
            <option value="Plants">Plants</option>
            <option value="Bakery">Bakery</option>
          </select>
          <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
            <option value="all">Any Availability</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value)}>
            <option value="all">All Picks</option>
            <option value="featured">Featured Only</option>
            <option value="new">New Arrivals</option>
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
            {filteredProducts.map((product) => (
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
                <button
                  onClick={(e) => { e.preventDefault(); toggleCompare(product._id); }}
                  className={`compare-pill${compareIds.includes(product._id) ? ' active' : ''}`}
                  style={{
                    position: 'absolute', top: '50px', right: '10px', zIndex: 2,
                    background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)', borderRadius: '999px',
                    padding: '6px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.12)'
                  }}
                >
                  {compareIds.includes(product._id) ? '✓ Compare' : 'Compare'}
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

        {compareProducts.length > 0 && (
          <section className="compare-tray">
            <div className="compare-tray-header">
              <div>
                <h2>Compare Products</h2>
                <p>Up to 3 items can be compared side by side</p>
              </div>
              <div className="compare-tray-actions">
                <button type="button" onClick={() => setShowCompare((value) => !value)}>
                  {showCompare ? 'Hide' : 'Show'}
                </button>
                <button type="button" onClick={() => setCompareIds([])}>Clear</button>
              </div>
            </div>

            {showCompare && (
              <div className="compare-grid">
                {compareProducts.map((product) => (
                  <article key={product._id} className="compare-card">
                    <img src={product.image || FALLBACK} alt={product.name} onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                    <h3>{product.name}</h3>
                    <p>{formatPrice(product.price)}</p>
                    <span>⭐ {product.rating}</span>
                    <span>{product.category}</span>
                    <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                    <button type="button" onClick={() => toggleCompare(product._id)}>Remove</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Products;

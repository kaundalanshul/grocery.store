import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { NavigationBar } from '../components/Home/NavigationBar';
import { useCart } from '../context/CartContext';
import { products as fallbackProducts } from '../data/products';
import '../styles/home.css';
import '../App.css';

const FALLBACK = 'https://via.placeholder.com/300x300?text=No+Image';
const INITIAL_CATEGORY_PRODUCTS = (fallbackProducts || []).map((product) => ({
  ...product,
  _id: product._id || product.id,
}));

const CategoryProducts = ({ theme, onToggleTheme }) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [addedId, setAddedId] = useState(null);

  // Advanced search/filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState(15000);
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [inStockOnlyFilter, setInStockOnlyFilter] = useState(false);

  const decodedCategory = decodeURIComponent(categoryName);
  const fallbackCategoryProducts = useMemo(() =>
    INITIAL_CATEGORY_PRODUCTS.filter((product) => product.category === decodedCategory),
    [decodedCategory]
  );

  useEffect(() => {
    setProducts(fallbackCategoryProducts);
  }, [fallbackCategoryProducts]);

  const fetchProducts = useCallback(async () => {
    try {
      setError('');
      const { data } = await axios.get(
        `/api/products/category/${encodeURIComponent(decodedCategory)}`,
        { params: sortBy ? { sort: sortBy } : {} }
      );
      const fetchedProducts = Array.isArray(data.products) && data.products.length > 0
        ? data.products.map((product) => ({ ...product, _id: product._id || product.id }))
        : fallbackCategoryProducts;
      setProducts(fetchedProducts);

      if (fetchedProducts.length > 0) {
        const prices = fetchedProducts.map((p) => p.price);
        setMaxPriceFilter(Math.max(...prices));
      }
    } catch (err) {
      setProducts(fallbackCategoryProducts);
      setError('');
    } finally {
      setLoading(false);
    }
  }, [decodedCategory, sortBy, fallbackCategoryProducts]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [fetchProducts]);

  // Handle resetting filters
  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSubcategory('All');
    setMaxPriceFilter(absoluteMaxPrice);
    setMinRatingFilter(0);
    setInStockOnlyFilter(false);
  };

  // Dynamically extract unique subcategories from products list
  const subcategories = useMemo(() => {
    const subs = products.map((p) => p.subcategory).filter(Boolean);
    return ['All', ...new Set(subs)];
  }, [products]);

  // Combined real-time filtering of products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Subcategory filter
      if (selectedSubcategory !== 'All' && product.subcategory !== selectedSubcategory) {
        return false;
      }
      // 2. Local text search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesSub = product.subcategory?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSub) {
          return false;
        }
      }
      // 3. Max price filter
      if (product.price > maxPriceFilter) {
        return false;
      }
      // 4. Rating filter
      if (product.rating < minRatingFilter) {
        return false;
      }
      // 5. Stock filter
      if (inStockOnlyFilter && product.stock <= 0) {
        return false;
      }
      return true;
    });
  }, [products, selectedSubcategory, searchQuery, maxPriceFilter, minRatingFilter, inStockOnlyFilter]);

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
          <p className="breadcrumb">
            <Link to="/">Home</Link> › <Link to="/products">Products</Link> › {decodedCategory}
          </p>
          <h1>{decodedCategory}</h1>
          <p>
            {loading
              ? 'Loading products...'
              : `${filteredProducts.length} of ${products.length} products found`}
          </p>
        </div>

        <div className="products-controls">
          <div className="products-search-form" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <input
              type="text"
              placeholder={`Search in ${decodedCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="products-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="products-clear-btn"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'var(--text-light)',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            )}
          </div>
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

        {/* Subcategory Pills */}
        {!loading && !error && subcategories.length > 1 && (
          <div className="subcategory-pills">
            {subcategories.map((sub) => (
              <button
                key={sub}
                className={`subcategory-pill${selectedSubcategory === sub ? ' active' : ''}`}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        <div className="category-layout">
          {/* Sidebar Filters */}
          {!loading && !error && products.length > 0 && (
            <aside className="filters-sidebar-card">
              <h2>
                Filters
                {(searchQuery || selectedSubcategory !== 'All' || minRatingFilter > 0 || inStockOnlyFilter || maxPriceFilter < absoluteMaxPrice) && (
                  <button onClick={handleClearFilters} className="clear-filters-btn">
                    Reset
                  </button>
                )}
              </h2>

              {/* Price Filter */}
              <div className="filter-group">
                <h3>Max Price</h3>
                <input
                  type="range"
                  min="0"
                  max={absoluteMaxPrice || 15000}
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="filter-price-slider"
                />
                <div className="filter-price-inputs">
                  <span>₹0</span>
                  <span>{formatPrice(maxPriceFilter)}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <h3>Customer Rating</h3>
                <div className="filter-rating-options">
                  <label className="rating-filter-label">
                    <input
                      type="radio"
                      name="ratingFilter"
                      checked={minRatingFilter === 0}
                      onChange={() => setMinRatingFilter(0)}
                    />
                    <span>All Ratings</span>
                  </label>
                  <label className="rating-filter-label">
                    <input
                      type="radio"
                      name="ratingFilter"
                      checked={minRatingFilter === 4}
                      onChange={() => setMinRatingFilter(4)}
                    />
                    <span>4.0 <span className="stars">★</span> & above</span>
                  </label>
                  <label className="rating-filter-label">
                    <input
                      type="radio"
                      name="ratingFilter"
                      checked={minRatingFilter === 3}
                      onChange={() => setMinRatingFilter(3)}
                    />
                    <span>3.0 <span className="stars">★</span> & above</span>
                  </label>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="filter-group">
                <h3>Availability</h3>
                <label className="checkbox-filter-label">
                  <input
                    type="checkbox"
                    checked={inStockOnlyFilter}
                    onChange={(e) => setInStockOnlyFilter(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </aside>
          )}

          {/* Products Content Area */}
          <div className="products-content-area" style={{ width: '100%' }}>
            {loading && (
              <div className="products-loading">
                <div className="spinner" />
                <p>Loading {decodedCategory} products...</p>
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
                <p>😕 No products in "{decodedCategory}" yet.</p>
                <Link to="/products" className="products-view-btn">Browse All Products</Link>
              </div>
            )}
            {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
              <div className="products-empty">
                <p>😕 No products match your active filters.</p>
                <button onClick={handleClearFilters} className="products-view-btn">Clear All Filters</button>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <div className="products-list-grid">
                {filteredProducts.map((product) => (
                  <article key={product._id} className="products-list-card">
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
                        <Link className="products-view-btn" to={`/products/${product._id}`}>View</Link>
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
      </div>
    </div>
  );
};

export default CategoryProducts;

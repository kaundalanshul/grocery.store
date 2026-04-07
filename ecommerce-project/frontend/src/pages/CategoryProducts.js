import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NavigationBar } from '../components/Home/NavigationBar';
import { useCart } from '../context/CartContext';
import '../styles/home.css';
import '../App.css';

const FALLBACK = 'https://via.placeholder.com/300x300?text=No+Image';

const CategoryProducts = ({ theme, onToggleTheme }) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [addedId, setAddedId] = useState(null);

  const decodedCategory = decodeURIComponent(categoryName);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(
        `/api/products/category/${encodeURIComponent(decodedCategory)}`,
        { params: sortBy ? { sort: sortBy } : {} }
      );
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [decodedCategory, sortBy]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [fetchProducts]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? `$${price.toFixed(2)}` : price;

  return (
    <div className="page-wrapper">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
      <div className="products-page">
        <div className="products-header">
          <p className="breadcrumb">
            <Link to="/">Home</Link> › <Link to="/products">Products</Link> › {decodedCategory}
          </p>
          <h1>{decodedCategory}</h1>
          <p>{products.length} products found</p>
        </div>

        <div className="products-controls">
          <div />
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

        {!loading && !error && products.length > 0 && (
          <div className="products-list-grid">
            {products.map((product) => (
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
  );
};

export default CategoryProducts;

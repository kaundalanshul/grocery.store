import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { NavigationBar } from '../components/Home/NavigationBar';
import { useCart } from '../context/CartContext';
import '../styles/home.css';
import '../App.css';

const FALLBACK = 'https://via.placeholder.com/400x400?text=No+Image';

const ProductDetails = ({ theme, onToggleTheme }) => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data.product);
      } catch (err) {
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${(price * 83).toFixed(0)}` : price;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const stars = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
    return stars;
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
        <div className="products-page">
          <div className="products-loading">
            <div className="spinner" />
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrapper">
        <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
        <div className="products-page">
          <div className="products-header">
            <h1>Product Not Found</h1>
            <p>{error || 'This product does not exist or was removed.'}</p>
            <Link className="products-view-btn" to="/products">Back To Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
      <div className="products-page">
        <p className="breadcrumb">
          <Link to="/">Home</Link> › <Link to="/products">Products</Link> ›{' '}
          <Link to={`/category/${encodeURIComponent(product.category)}`}>{product.category}</Link> ›{' '}
          {product.name}
        </p>

        <div className="product-detail-layout">
          {/* Image */}
          <div className="product-detail-image-wrap">
            <img
              src={product.image || FALLBACK}
              alt={product.name}
              className="product-detail-image"
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
            />
            {product.discount && (
              <span className="detail-discount-badge">{product.discount} OFF</span>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-content">
            <p className="products-category">{product.category}</p>
            <h1>{product.name}</h1>

            <div className="detail-rating">
              <span className="stars">{renderStars(product.rating || 0)}</span>
              <span className="detail-rating-val">{product.rating} / 5</span>
              <span className="detail-reviews">({product.numReviews} reviews)</span>
            </div>

            <div className="products-pricing detail-pricing">
              <span className="products-current detail-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="products-original">{formatPrice(product.originalPrice)}</span>
              )}
              {product.discount && (
                <span className="detail-save-badge">Save {product.discount}</span>
              )}
            </div>

            {product.description && (
              <p className="product-detail-description">{product.description}</p>
            )}

            <div className="detail-meta">
              {product.sold > 0 && <span>🏷️ {product.sold} sold</span>}
              {product.stock > 0 ? (
                <span className="in-stock">✅ In Stock ({product.stock} left)</span>
              ) : (
                <span className="out-of-stock">❌ Out of Stock</span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="detail-quantity-row">
              <label>Quantity:</label>
              <div className="qty-controls">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={product.stock && quantity >= product.stock}
                >+</button>
              </div>
            </div>

            <div className="product-detail-actions">
              <button
                className={`detail-add-cart-btn${added ? ' added' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <Link className="detail-view-cart-btn" to="/cart">View Cart</Link>
            </div>

            <div className="detail-links">
              <Link className="auth-back-link" to="/products">← All Products</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
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

  // Review states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Check user
  const user = (() => {
    try {
      const stored = localStorage.getItem('authUser');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  })();

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

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      setReviewError('Please login to submit a review');
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError('');
      await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewSuccess(true);
      setRating(0);
      setComment('');
      // Optimistically reload product
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data.product);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
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

        {/* Reviews Section */}
        <div className="reviews-section" style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
          <h2>Customer Reviews</h2>
          <div className="reviews-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            <div className="reviews-list">
              {product.reviews && product.reviews.length === 0 && (
                <p>No reviews yet. Be the first to review this product!</p>
              )}
              {product.reviews && product.reviews.map((review) => (
                <div key={review._id} className="review-card" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong>{review.name}</strong>
                    <span className="stars" style={{ color: '#ffb400' }}>{renderStars(review.rating)}</span>
                  </div>
                  <p style={{ color: '#555', fontSize: '0.95rem', margin: '0 0 10px 0' }}>{review.comment}</p>
                  <small style={{ color: '#999' }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>

            <div className="write-review">
              <h3>Write a Review</h3>
              {user ? (
                <form onSubmit={submitReviewHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {reviewError && <div style={{ color: 'red', fontSize: '0.9rem' }}>{reviewError}</div>}
                  {reviewSuccess && <div style={{ color: 'green', fontSize: '0.9rem' }}>Review submitted successfully!</div>}
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Rating</label>
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Comment</label>
                    <textarea 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={reviewLoading}
                    style={{ background: '#333', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ marginBottom: '15px' }}>Please login to write a review.</p>
                  <Link to="/login" style={{ background: '#007bff', color: '#fff', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px' }}>Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { NavigationBar } from '../components/Home/NavigationBar';
import { useCart } from '../context/CartContext';
import { products as fallbackProducts } from '../data/products';
import '../styles/home.css';
import '../App.css';

const FALLBACK = 'https://via.placeholder.com/400x400?text=No+Image';
const INITIAL_PRODUCTS = (fallbackProducts || []).map((product) => ({
  ...product,
  _id: product._id || product.id,
}));

const RECENT_KEY = 'recentlyViewedProducts';

const readRecentProducts = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch (_) {
    return [];
  }
};

const saveRecentProduct = (product) => {
  if (!product?._id) return;

  try {
    const entry = {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      category: product.category,
      rating: product.rating,
    };
    const existing = readRecentProducts().filter((item) => item._id !== entry._id);
    const next = [entry, ...existing].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('recent-products-updated'));
  } catch (_) {}
};

const ProductDetails = ({ theme, onToggleTheme }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const fallbackProduct = INITIAL_PRODUCTS.find((item) => item._id === productId || item.id === productId);
  const [product, setProduct] = useState(fallbackProduct || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`/api/products/${productId}`);
        const nextProduct = data.product || fallbackProduct || null;
        setProduct(nextProduct);
        if (nextProduct) {
          saveRecentProduct(nextProduct);
        }
      } catch (err) {
        setProduct(fallbackProduct || null);
        setError('');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId, fallbackProduct]);

  useEffect(() => {
    setRecentProducts(readRecentProducts().filter((item) => item._id !== productId));
  }, [productId, product]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.category) {
        setRelatedProducts([]);
        return;
      }

      try {
        const { data } = await axios.get('/api/products', {
          params: { category: product.category, limit: 8 },
        });
        const items = (data.products || [])
          .map((item) => ({ ...item, _id: item._id || item.id }))
          .filter((item) => item._id !== product._id)
          .slice(0, 4);
        setRelatedProducts(items);
      } catch (_) {
        setRelatedProducts(
          INITIAL_PRODUCTS.filter((item) => item.category === product.category && item._id !== product._id).slice(0, 4)
        );
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        checkoutItems: [{
          ...product,
          quantity: quantity
        }]
      }
    });
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toFixed(2)}` : price;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const stars = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
    return stars;
  };

  const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
  const averageReviewRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewMessage('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setReviewMessage('Please log in to write a review.');
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewMessage('Review comment is required.');
      return;
    }

    try {
      setSubmittingReview(true);
      const { data } = await axios.post(
        `/api/products/${productId}/reviews`,
        {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setReviewMessage('Review added successfully.');
        setReviewForm({ rating: 5, comment: '' });
        const refreshed = await axios.get(`/api/products/${productId}`);
        setProduct(refreshed.data.product || product);
      }
    } catch (submitError) {
      setReviewMessage(submitError.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
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
              <button
                className="detail-buy-now-btn"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                ⚡ Buy Now
              </button>
              <Link className="detail-view-cart-btn" to="/cart">View Cart</Link>
            </div>

            <div className="detail-links">
              <Link className="auth-back-link" to="/products">← All Products</Link>
            </div>
          </div>
        </div>

        <div className="product-detail-secondary-grid">
          <section className="detail-review-panel">
            <div className="detail-section-heading">
              <div>
                <h2>Reviews</h2>
                <p>{averageReviewRating} average rating from {reviews.length} review(s)</p>
              </div>
            </div>

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="review-form-row">
                <label>
                  Rating
                  <select name="rating" value={reviewForm.rating} onChange={handleReviewChange}>
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>{value} stars</option>
                    ))}
                  </select>
                </label>
                <label className="review-comment-label">
                  Comment
                  <textarea
                    name="comment"
                    rows="4"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    placeholder="Share what you liked about this product"
                  />
                </label>
              </div>
              {reviewMessage && <p className="review-message">{reviewMessage}</p>}
              <button className="review-submit-btn" type="submit" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="empty-review-state">No reviews yet. Be the first to review this product.</p>
              ) : (
                reviews.map((review, index) => (
                  <article key={`${review.user || index}-${review.createdAt || index}`} className="review-card">
                    <div className="review-topline">
                      <strong>{review.name || 'Verified buyer'}</strong>
                      <span>{renderStars(Number(review.rating || 0))}</span>
                    </div>
                    <p>{review.comment}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="detail-related-panel">
            <div className="detail-section-heading">
              <div>
                <h2>Related Products</h2>
                <p>More items from {product.category}</p>
              </div>
            </div>
            <div className="related-products-grid">
              {relatedProducts.length === 0 ? (
                <p className="empty-review-state">No related products available right now.</p>
              ) : (
                relatedProducts.map((item) => (
                  <Link key={item._id} to={`/products/${item._id}`} className="related-product-card">
                    <img src={item.image || FALLBACK} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>{formatPrice(item.price)}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

        {recentProducts.length > 0 && (
          <section className="detail-recent-panel">
            <div className="detail-section-heading">
              <div>
                <h2>Recently Viewed</h2>
                <p>Pick up where you left off</p>
              </div>
            </div>
            <div className="recent-products-row">
              {recentProducts.map((item) => (
                <Link key={item._id} to={`/products/${item._id}`} className="recent-product-chip">
                  <img src={item.image || FALLBACK} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
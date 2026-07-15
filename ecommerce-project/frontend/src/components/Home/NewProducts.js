// New Products Component — API fetched + Add to Cart
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const FALLBACK = 'https://via.placeholder.com/300x240?text=No+Image';

export const NewProducts = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    axios.get('/api/products', { params: { limit: 8 } })
      .then(({ data }) => {
        const all = data.products || [];
        setProducts(all.slice(4));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const formatPrice = (p) => typeof p === 'number' ? `₹${(p * 83).toFixed(0)}` : p;

  if (loading) return <section className="new-products"><h2>New Products</h2><p>Loading...</p></section>;

  return (
    <section className="new-products">
      <h2>New Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image-wrapper">
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.image || FALLBACK}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                />
              </Link>
              {product.discount && (
                <span className="discount-badge">{product.discount}</span>
              )}
              <div className="quick-actions">
                <button
                  className="action-btn"
                  title="Wishlist"
                  onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                >
                  {isInWishlist(product._id) ? '❤️' : '🤍'}
                </button>
                <button
                  className={`action-btn${addedId === product._id ? ' added' : ''}`}
                  title="Add to Cart"
                  onClick={() => handleAddToCart(product)}
                >
                  {addedId === product._id ? '✓' : '🛒'}
                </button>
                <Link className="action-btn" title="View Details" to={`/products/${product._id}`}>
                  👁️
                </Link>
              </div>
            </div>
            <div className="product-details">
              <h3>
                <Link className="product-link" to={`/products/${product._id}`}>
                  {product.name}
                </Link>
              </h3>
              <div className="rating-section">
                <span className="stars">★★★★☆</span>
                <span className="rating-value">{product.rating}</span>
              </div>
              <div className="pricing-section">
                <span className="price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewProducts;
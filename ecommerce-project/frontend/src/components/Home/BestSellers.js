// Best Sellers Component — Add to Cart connected via CartContext
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const FALLBACK = 'https://via.placeholder.com/300x200?text=No+Image';

export const BestSellers = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    axios.get('/api/products', { params: { sort: 'popular', limit: 4 } })
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const formatPrice = (p) => typeof p === 'number' ? `₹${p.toFixed(2)}` : p;

  if (loading) return <section className="best-sellers"><h2>BEST SELLERS</h2><p>Loading...</p></section>;

  return (
    <section className="best-sellers">
      <h2>BEST SELLERS</h2>
      <div className="sellers-grid">
        {products.map((product) => (
          <div key={product._id} className="seller-card">
            <div className="product-image" style={{ position: 'relative' }}>
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
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.image || FALLBACK}
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                />
              </Link>
            </div>
            <div className="product-info">
              <h4>
                <Link className="product-link" to={`/products/${product._id}`}>
                  {product.name}
                </Link>
              </h4>
              <div className="rating">
                <span className="stars">★ {product.rating}</span>
                <span className="sold-count">Sold: {product.sold}</span>
              </div>
              <div className="price">
                <span className="current">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="original">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <button
                className={`seller-cart-btn${addedId === product._id ? ' added' : ''}`}
                onClick={() => handleAddToCart(product)}
              >
                {addedId === product._id ? '✓ Added!' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="best-sellers-footer">
        <Link className="see-more-btn" to="/products">See All Products</Link>
      </div>
    </section>
  );
};

export default BestSellers;
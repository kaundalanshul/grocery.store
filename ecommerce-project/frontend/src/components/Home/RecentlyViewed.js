import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RECENT_KEY = 'recentlyViewedProducts';

const readRecentProducts = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch (_) {
    return [];
  }
};

export const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const syncRecent = () => setProducts(readRecentProducts());
    syncRecent();
    window.addEventListener('storage', syncRecent);
    window.addEventListener('recent-products-updated', syncRecent);
    return () => {
      window.removeEventListener('storage', syncRecent);
      window.removeEventListener('recent-products-updated', syncRecent);
    };
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="recently-viewed-section">
      <div className="section-heading">
        <h2>Recently Viewed</h2>
        <p>Products you checked out earlier in this session</p>
      </div>
      <div className="recently-viewed-grid">
        {products.slice(0, 4).map((product) => (
          <Link key={product._id} to={`/products/${product._id}`} className="recently-viewed-card">
            <img
              src={product.image || 'https://via.placeholder.com/200x160?text=No+Image'}
              alt={product.name}
            />
            <div>
              <h3>{product.name}</h3>
              <p>{typeof product.price === 'number' ? `₹${product.price.toFixed(2)}` : product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
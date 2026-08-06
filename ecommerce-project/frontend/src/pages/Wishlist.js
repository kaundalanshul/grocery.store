import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const Wishlist = ({ theme }) => {
  const { wishlist, loading, toggleWishlist } = useWishlist();

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  return (
    <div className={`wishlist-page ${theme}`}>
      <div className="container">
        <h2>My Wishlist</h2>
        {wishlist.length === 0 ? (
          <div className="empty-state">
            <p>Your wishlist is currently empty.</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlist.map((product) => {
              // Handle case where product is just an ID vs a populated object
              const isPopulated = typeof product === 'object' && product._id;
              const id = isPopulated ? product._id : product;
              const name = isPopulated ? product.name : 'Loading product details...';
              const price = isPopulated ? product.price : 0;
              const image = isPopulated ? product.image : '';

              return (
                <div key={id} className="product-card">
                  <div className="wishlist-btn active" onClick={() => toggleWishlist(id)}>
                    ❤️
                  </div>
                  {isPopulated && (
                    <Link to={`/products/${id}`}>
                      <img src={image || 'https://via.placeholder.com/300x300'} alt={name} className="product-image" />
                    </Link>
                  )}
                  <div className="product-info">
                    <Link to={`/products/${id}`} className="product-title-link">
                      <h3 className="product-title">{name}</h3>
                    </Link>
                    {isPopulated && (
                      <div className="product-price">${price.toFixed(2)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .wishlist-page {
          padding: 40px 20px;
          min-height: 80vh;
        }
        .wishlist-page h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
        }
        .empty-state {
          text-align: center;
          margin-top: 50px;
        }
        .empty-state p {
          margin-bottom: 20px;
          font-size: 1.2rem;
          color: #666;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 30px;
        }
        .product-card {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #fff;
        }
        .dark .product-card {
          background: #2a2a2a;
          border-color: #444;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .product-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }
        .product-info {
          padding: 15px;
        }
        .product-title-link {
          text-decoration: none;
          color: inherit;
        }
        .product-title {
          font-size: 1.1rem;
          margin-bottom: 10px;
          color: #333;
        }
        .dark .product-title {
          color: #fff;
        }
        .product-price {
          font-weight: bold;
          font-size: 1.2rem;
          color: #e53935;
        }
        .wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          z-index: 2;
          user-select: none;
          transition: transform 0.2s;
        }
        .wishlist-btn:active {
          transform: scale(0.9);
        }
        .dark .wishlist-btn {
          background: rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default Wishlist;

// Hero Banner Component — real Unsplash image, Shop Now navigates to products
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <div className="hero-content">
        <p className="hero-tag">✨ New Collection 2025</p>
        <h2>Trending Accessories</h2>
        <h1>MODERN<br />SUNGLASSES</h1>
        <p>Elevate your style with premium eyewear — starting at <strong>$19.00</strong></p>
        <div className="hero-actions">
          <button className="shop-btn" onClick={() => navigate('/category/Accessories')}>
            SHOP NOW →
          </button>
          <button className="shop-btn-outline" onClick={() => navigate('/products')}>
            All Products
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80"
          alt="Modern Sunglasses"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=Sunglasses';
          }}
        />
      </div>
    </section>
  );
};

export default HeroBanner;
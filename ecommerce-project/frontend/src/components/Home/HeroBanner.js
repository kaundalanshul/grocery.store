// Hero Banner Component — real Unsplash image, Shop Now navigates to products
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <div className="hero-content">
        <p className="hero-tag">✨ Everything You Need</p>
        <h2>The Ultimate Marketplace</h2>
        <h1>SHOP<br />SMARTER</h1>
        <p>Explore thousands of products across <strong>Grocery, Fashion, Electronics, & More</strong></p>
        <div className="hero-actions">
          <button className="shop-btn" onClick={() => navigate('/products')}>
            SHOP NOW →
          </button>
          <button className="shop-btn-outline" onClick={() => navigate('/category/Grocery')}>
            Daily Essentials
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80"
          alt="MegaMart Marketplace"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/600x400?text=Marketplace';
          }}
        />
      </div>
    </section>
  );
};

export default HeroBanner;
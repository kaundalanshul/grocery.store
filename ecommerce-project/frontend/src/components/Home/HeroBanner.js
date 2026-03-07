// Hero Banner Component
// Featured banner with trending products and promotional content

import React from 'react';

export const HeroBanner = () => {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <h2>Trending Accessories</h2>
        <h1>MODERN SUNGLASSES</h1>
        <p>starting at $ 19.00</p>
        <button className="shop-btn">SHOP NOW</button>
      </div>
      <div className="hero-image">
        <img src="/images/hero-sunglasses.jpg" alt="Modern Sunglasses" />
      </div>
    </section>
  );
};

export default HeroBanner;
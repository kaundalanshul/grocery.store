// Hero Banner Component — Myntra "Big Brands Bash" Promotional Hero
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroBanner = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      badge: 'BIG BRANDS BASH • LIVE NOW',
      title: 'EPIC SAVINGS',
      priceTag: 'UNDER ₹499',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
      bankOffer: 'HSBC | YES BANK | 10% Instant Discount*',
    },
    {
      badge: 'SUPER SAVINGS SALE • ACTIVE',
      title: 'FRESH ESSENTIALS',
      priceTag: 'FLAT 40% OFF',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
      bankOffer: 'HDFC BANK | ICICI | Flat ₹150 Cashback*',
    },
  ];

  const current = slides[activeSlide];

  return (
    <section className="myntra-hero-carousel-card" onClick={() => navigate('/products')}>
      <div className="hero-main-card">
        <div className="hero-product-stage">
          <img
            src={current.image}
            alt="Hero Promotion"
            className="hero-backdrop-img"
          />
        </div>

        <div className="hero-overlay-callout">
          <div className="brand-bash-badge">
            <span className="brand-logo-mini">M🌿</span>
            <div className="badge-text-group">
              <strong>BIG BRANDS BASH</strong>
              <span className="live-dot-tag">● LIVE NOW</span>
            </div>
          </div>

          <div className="epic-savings-banner">
            <h3>{current.title}</h3>
            <div className="price-callout-pill">{current.priceTag}</div>
          </div>

          <button
            type="button"
            className="hero-next-chevron"
            aria-label="Next slide"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide((prev) => (prev + 1) % slides.length);
            }}
          >
            ›
          </button>
        </div>

        {/* Bank Discount Ticker */}
        <div className="hero-bank-strip">
          <div className="bank-logos">
            <span className="bank-tag">HSBC</span>
            <span className="bank-tag accent">✓ YES BANK</span>
          </div>
          <span className="bank-offer-text">{current.bankOffer}</span>
        </div>
      </div>

      {/* Carousel Dot Indicators */}
      <div className="hero-dots-row">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`hero-dot ${activeSlide === idx ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide(idx);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
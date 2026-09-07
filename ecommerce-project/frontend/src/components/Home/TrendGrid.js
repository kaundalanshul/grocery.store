// Trend Grid Component — Squircle subcategories & trending picks
import React from 'react';
import { Link } from 'react-router-dom';

const TRENDS = [
  {
    name: 'Jeans',
    path: '/category/Apparel',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&q=80',
    icon: '👖',
    color: '#eef2ff',
  },
  {
    name: 'T-Shirt',
    path: '/category/Apparel',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&q=80',
    icon: '👕',
    color: '#fdf2f8',
  },
  {
    name: 'Trousers',
    path: '/category/Apparel',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&q=80',
    icon: '👖',
    color: '#f3f4f6',
  },
  {
    name: 'Casual Shoes',
    path: '/category/Shoes',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&q=80',
    icon: '👟',
    color: '#ecfdf5',
  },
  {
    name: 'Flip Flops',
    path: '/category/Shoes',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=200&q=80',
    icon: '🩴',
    color: '#fef3c7',
  },
  {
    name: 'Fresh Fruits',
    path: '/category/Grocery',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80',
    icon: '🍎',
    color: '#fee2e2',
  },
  {
    name: 'Office Chairs',
    path: '/category/Furniture',
    image: 'https://images.unsplash.com/photo-1580481077197-047f2a70473a?w=200&q=80',
    icon: '🪑',
    color: '#e0e7ff',
  },
  {
    name: 'Bakery Treats',
    path: '/category/Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=80',
    icon: '🥐',
    color: '#fae8ff',
  },
  {
    name: 'Indoor Plants',
    path: '/category/Plants',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&q=80',
    icon: '🪴',
    color: '#ecfccb',
  },
  {
    name: 'Books',
    path: '/category/Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80',
    icon: '📖',
    color: '#ffedd5',
  },
];

export const TrendGrid = () => {
  return (
    <section className="trend-grid-section">
      {/* Brand Partner Strip */}
      <div className="sponsor-bar">
        <span className="sponsor-label">POWERED BY</span>
        <span className="sponsor-divider">|</span>
        <span className="sponsor-brand">PALMONAS ›</span>
        <span className="sponsor-divider">|</span>
        <span className="sponsor-brand">INDDUS ›</span>
        <span className="sponsor-divider">|</span>
        <span className="sponsor-brand">ORGANIC HARVEST ›</span>
      </div>

      {/* Grid of Trending Categories */}
      <div className="trend-squircle-grid">
        {TRENDS.map((t) => (
          <Link to={t.path} key={t.name} className="trend-card">
            <div className="trend-img-box" style={{ background: t.color }}>
              <img
                src={t.image}
                alt={t.name}
                className="trend-thumb-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="trend-fallback-icon">{t.icon}</span>
            </div>
            <span className="trend-card-title">{t.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendGrid;

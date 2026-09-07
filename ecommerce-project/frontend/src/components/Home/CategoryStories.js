// Category Stories Component — Myntra-style Rounded Squircle Story Carousel
import React from 'react';
import { Link } from 'react-router-dom';

const STORIES = [
  {
    name: 'Fashion',
    path: '/category/Apparel',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&q=80',
    icon: '👗',
    color: '#fee2e2',
  },
  {
    name: 'Beauty',
    path: '/category/Stationery',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&q=80',
    icon: '💄',
    color: '#fce7f3',
  },
  {
    name: 'Homeliving',
    path: '/category/Furniture',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&q=80',
    icon: '🛋️',
    color: '#fef3c7',
  },
  {
    name: 'Footwear',
    path: '/category/Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
    icon: '👟',
    color: '#dbeafe',
  },
  {
    name: 'Accessories',
    path: '/category/Apparel',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80',
    icon: '👜',
    color: '#dcfce7',
  },
  {
    name: 'Grocery',
    path: '/category/Grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80',
    icon: '🛒',
    color: '#e0e7ff',
  },
  {
    name: 'Bakery',
    path: '/category/Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80',
    icon: '🍰',
    color: '#fae8ff',
  },
  {
    name: 'Plants',
    path: '/category/Plants',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&q=80',
    icon: '🌿',
    color: '#ecfccb',
  },
  {
    name: 'Books',
    path: '/category/Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80',
    icon: '📚',
    color: '#ffedd5',
  },
];

export const CategoryStories = () => {
  return (
    <section className="myntra-stories-section" aria-label="Explore Categories">
      <div className="stories-scroll-container">
        {STORIES.map((item, idx) => (
          <Link
            key={item.name}
            to={item.path}
            className={`story-item-card ${idx === 0 ? 'highlight' : ''}`}
          >
            <div className="story-squircle-wrap" style={{ background: item.color }}>
              <img
                src={item.image}
                alt={item.name}
                className="story-squircle-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="story-fallback-icon">{item.icon}</span>
            </div>
            <span className="story-label">{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryStories;

// Category Sidebar Component
// Navigation categories with subcategories and item counts

import React, { useState } from 'react';

export const CategorySidebar = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    { name: 'Clothes', subcategories: ['Shirts', 'Pants', 'Dresses', 'Jackets'], icon: '👕' },
    { name: 'Footwear', subcategories: ['Shoes', 'Boots', 'Sneakers', 'Sandals'], icon: '👟' },
    { name: 'Accessories', subcategories: ['Belts', 'Bags', 'Scarves', 'Hats'], icon: '👜' },
    { name: 'Jewelry', subcategories: ['Rings', 'Earrings', 'Necklaces', 'Bracelets'], icon: '💍' },
    { name: 'Electronics', subcategories: ['Watches', 'Headphones', 'Chargers'], icon: '⌚' },
    { name: 'Perfume', subcategories: ['Women', 'Men', 'Unisex'], icon: '🧴' },
    { name: 'Cosmetics', subcategories: ['Makeup', 'Skincare', 'Hair Care'], icon: '💄' },
  ];

  return (
    <aside className="category-sidebar">
      <h3>CATEGORIES</h3>
      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.name} className="category-item">
            <button 
              className="category-btn"
              onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
            >
              <span>{category.icon} {category.name}</span>
              <span className="arrow">›</span>
            </button>
            {expandedCategory === category.name && (
              <ul className="subcategories">
                {category.subcategories.map((sub) => (
                  <li key={sub}><a href={`/category/${sub}`}>{sub}</a></li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CategorySidebar;
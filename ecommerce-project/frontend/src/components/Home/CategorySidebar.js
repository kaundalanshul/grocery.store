// Category Sidebar Component — uses React Router Link (no page reload)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const CategorySidebar = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Grocery',
      subcategories: ['Rice & Grains', 'Oils & Ghee', 'Breakfast & Spreads', 'Beverages', 'Snacks & Dry Fruits', 'Spices & Masala'],
      icon: '🛒',
      slug: 'Grocery',
    },
    {
      name: 'Shoes',
      subcategories: ['Sneakers', 'Boots', 'Formal', 'Heels', 'Sandals'],
      icon: '👟',
      slug: 'Shoes',
    },
    {
      name: 'Apparel',
      subcategories: ["Men's Shirts", "Women's Dresses", "Jackets & Coats", "Men's Pants", "Women's Tops", "Activewear"],
      icon: '👕',
      slug: 'Apparel',
    },
    {
      name: 'Stationery',
      subcategories: ['Pens & Pencils', 'Notebooks & Diaries', 'Art Supplies', 'Desk Accessories'],
      icon: '✏️',
      slug: 'Stationery',
    },
    {
      name: 'Bakery',
      subcategories: ['Breads', 'Cakes', 'Pastries', 'Cookies & Biscuits'],
      icon: '🍰',
      slug: 'Bakery',
    },
    {
      name: 'Sports',
      subcategories: ['Fitness', 'Team Sports', 'Racket Sports', 'Outdoor & Camping', 'Swimming'],
      icon: '⚽',
      slug: 'Sports',
    },
    {
      name: 'Furniture',
      subcategories: ['Office', 'Storage', 'Living Room', 'Bedroom'],
      icon: '🪑',
      slug: 'Furniture',
    },
    {
      name: 'Plants',
      subcategories: ['Indoor Plants', 'Succulents & Cacti', 'Herbs & Edibles', 'Planters & Pots', 'Outdoor Plants'],
      icon: '🌿',
      slug: 'Plants',
    },
    {
      name: 'Books',
      subcategories: ['Self-Help', 'Non-Fiction', 'Fiction', 'Academic & Technical', "Children's"],
      icon: '📚',
      slug: 'Books',
    },
  ];

  const handleCategoryClick = (slug) => {
    navigate(`/category/${encodeURIComponent(slug)}`);
    setExpandedCategory(null);
  };

  return (
    <aside className="category-sidebar">
      <h3>CATEGORIES</h3>
      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.name} className="category-item">
            <button
              className="category-btn"
              onClick={() =>
                setExpandedCategory(expandedCategory === category.name ? null : category.name)
              }
            >
              <span>{category.icon} {category.name}</span>
              <span className={`arrow${expandedCategory === category.name ? ' open' : ''}`}>›</span>
            </button>

            {expandedCategory === category.name && (
              <ul className="subcategories">
                <li>
                  <button
                    className="subcat-link subcat-all"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    All {category.name}
                  </button>
                </li>
                {category.subcategories.map((sub) => (
                  <li key={sub}>
                    <Link
                      to={`/category/${encodeURIComponent(category.slug)}`}
                      className="subcat-link"
                    >
                      {sub}
                    </Link>
                  </li>
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
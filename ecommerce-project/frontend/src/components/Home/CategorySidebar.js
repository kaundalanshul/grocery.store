// Category Sidebar Component — uses React Router Link (no page reload)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const CategorySidebar = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

  const categories = [
    {
      name: "Men's",
      subcategories: ['Shirts', 'Pants', 'Jackets', 'Suits'],
      icon: '👔',
      slug: "Men's",
    },
    {
      name: "Women's",
      subcategories: ['Dresses', 'Tops', 'Coats', 'Activewear'],
      icon: '👗',
      slug: "Women's",
    },
    {
      name: 'Footwear',
      subcategories: ['Boots', 'Sneakers', 'Sandals', 'Heels'],
      icon: '👟',
      slug: 'Footwear',
    },
    {
      name: 'Accessories',
      subcategories: ['Bags', 'Belts', 'Scarves', 'Hats'],
      icon: '👜',
      slug: 'Accessories',
    },
    {
      name: 'Jewelry',
      subcategories: ['Rings', 'Earrings', 'Necklaces', 'Bracelets'],
      icon: '💍',
      slug: 'Jewelry',
    },
    {
      name: 'Outerwear',
      subcategories: ['Blazers', 'Trench Coats', 'Windbreakers'],
      icon: '🧥',
      slug: 'Outerwear',
    },
    {
      name: 'Cosmetics',
      subcategories: ['Makeup', 'Skincare', 'Hair Care'],
      icon: '💄',
      slug: 'Cosmetics',
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
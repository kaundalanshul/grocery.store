// New Products Component
// Grid display of latest products with quick actions

import React from 'react';

export const NewProducts = () => {
  const newProducts = [
    { 
      id: 1, 
      name: 'Winter Leather Jacket', 
      price: '$89.00', 
      originalPrice: '$120.00',
      rating: 4.5,
      discount: '25%',
      image: '/images/winter-jacket.jpg'
    },
    { 
      id: 2, 
      name: 'Camel Wool Coat', 
      price: '$145.00', 
      originalPrice: '$200.00',
      rating: 4.6,
      discount: '27%',
      image: '/images/wool-coat.jpg'
    },
    { 
      id: 3, 
      name: 'Black Leather Blazer', 
      price: '$125.00', 
      originalPrice: '$180.00',
      rating: 4.7,
      discount: '30%',
      image: '/images/blazer.jpg'
    },
    { 
      id: 4, 
      name: 'Navy Blue Dress Shirt', 
      price: '$65.00', 
      originalPrice: '$95.00',
      rating: 4.4,
      discount: '31%',
      image: '/images/dress-shirt.jpg'
    },
  ];

  return (
    <section className="new-products">
      <h2>New Products</h2>
      <div className="products-grid">
        {newProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.name} className="product-image" />
              <span className="discount-badge">{product.discount}</span>
              <div className="quick-actions">
                <button className="action-btn" title="Add to Cart">🛒</button>
                <button className="action-btn" title="Add to Wishlist">❤️</button>
                <button className="action-btn" title="Compare">⚖️</button>
              </div>
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <div className="rating-section">
                <span className="stars">★★★★☆</span>
                <span className="rating-value">{product.rating}</span>
              </div>
              <div className="pricing-section">
                <span className="price">{product.price}</span>
                <span className="original-price">{product.originalPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewProducts;
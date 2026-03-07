// Best Sellers Component
// Display top selling products with ratings

import React from 'react';

export const BestSellers = () => {
  const bestSellers = [
    { 
      id: 1, 
      name: 'Classic Cotton T-Shirt', 
      price: '$15.50', 
      originalPrice: '$25.00',
      rating: 4.5,
      sold: 156,
      image: '/images/tshirt.jpg'
    },
    { 
      id: 2, 
      name: 'Denim Jacket Blue', 
      price: '$65.00', 
      originalPrice: '$95.00',
      rating: 4.8,
      sold: 234,
      image: '/images/jacket.jpg'
    },
    { 
      id: 3, 
      name: 'Black Leather Boots', 
      price: '$89.99', 
      originalPrice: '$120.00',
      rating: 4.6,
      sold: 189,
      image: '/images/boots.jpg'
    },
    { 
      id: 4, 
      name: 'Summer Dress Floral', 
      price: '$42.00', 
      originalPrice: '$65.00',
      rating: 4.7,
      sold: 312,
      image: '/images/dress.jpg'
    },
  ];

  return (
    <section className="best-sellers">
      <h2>BEST SELLERS</h2>
      <div className="sellers-grid">
        {bestSellers.map((product) => (
          <div key={product.id} className="seller-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <div className="rating">
                <span className="stars">★ {product.rating}</span>
                <span className="sold-count">Sold: {product.sold}</span>
              </div>
              <div className="price">
                <span className="current">{product.price}</span>
                <span className="original">{product.originalPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
// Deal of the Day — Add to Cart connected
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

const dealProduct = {
  _id: 'deal-001',
  name: 'Premium Shampoo, Conditioner & Face Wash Pack',
  description:
    'Complete hair and skincare combo with premium ingredients. Sulfate-free formula for all hair types. Dermatologically tested and approved.',
  price: 150.00,
  originalPrice: 200.00,
  discount: '25%',
  image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
  category: 'Cosmetics',
  stock: 40,
  sold: 30,
};

export const DealOfTheDay = () => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 59, seconds: 59 });
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    addToCart(dealProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="deal-of-day">
      <h2>Deal Of The Day</h2>
      <div className="deal-container">
        <div className="deal-image">
          <img
            src={dealProduct.image}
            alt={dealProduct.name}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x300?text=Deal'; }}
          />
        </div>
        <div className="deal-content">
          <h3>{dealProduct.name}</h3>
          <p className="description">{dealProduct.description}</p>
          <div className="pricing">
            <span className="discount-price">${dealProduct.price.toFixed(2)}</span>
            <span className="original-price">${dealProduct.originalPrice.toFixed(2)}</span>
            <span className="discount-badge">-{dealProduct.discount}</span>
          </div>
          <div className="countdown">
            <h4>⏰ Offer Ends In:</h4>
            <div className="timer">
              <div className="time-unit"><span>{pad(timeLeft.hours)}</span><p>Hours</p></div>
              <div className="time-unit"><span>{pad(timeLeft.minutes)}</span><p>Mins</p></div>
              <div className="time-unit"><span>{pad(timeLeft.seconds)}</span><p>Secs</p></div>
            </div>
          </div>
          <button
            className={`add-to-cart-btn${added ? ' added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? '✓ ADDED TO CART!' : 'ADD TO CART'}
          </button>
          <p className="stock-info">
            ALREADY SOLD: {dealProduct.sold} | AVAILABLE: {dealProduct.stock - dealProduct.sold}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
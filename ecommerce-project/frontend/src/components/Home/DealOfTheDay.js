// Deal of the Day Component
// Highlight daily special offer with countdown timer

import React, { useState, useEffect } from 'react';

export const DealOfTheDay = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="deal-of-day">
      <h2>Deal Of The Day</h2>
      <div className="deal-container">
        <div className="deal-image">
          <img src="/images/shampoo-set.jpg" alt="Shampoo Set" />
        </div>
        <div className="deal-content">
          <h3>Premium Shampoo, Conditioner & Face Wash Pack</h3>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="pricing">
            <span className="discount-price">$150.00</span>
            <span className="original-price">$200.00</span>
            <span className="discount-badge">-25%</span>
          </div>
          <div className="countdown">
            <h4>Offer Ends In:</h4>
            <div className="timer">
              <div className="time-unit"><span>{String(timeLeft.hours).padStart(2, '0')}</span><p>Hours</p></div>
              <div className="time-unit"><span>{String(timeLeft.minutes).padStart(2, '0')}</span><p>Minutes</p></div>
              <div className="time-unit"><span>{String(timeLeft.seconds).padStart(2, '0')}</span><p>Seconds</p></div>
            </div>
          </div>
          <button className="add-to-cart-btn">ADD TO CART</button>
          <p className="stock-info">ALREADY SOLD: 30 | AVAILABLE: 40</p>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
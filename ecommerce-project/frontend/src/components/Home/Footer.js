// Footer Component
// Company info, links, and social media

import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ABOUT COMPANY</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>SUPPORT</h3>
          <ul>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>CONTACT</h3>
          <p>📍 123 Fashion Street, NY 10001</p>
          <p>📧 support@anon.com</p>
          <p>📞 1-800-ANON-123</p>
        </div>

        <div className="footer-section">
          <h3>FOLLOW US</h3>
          <div className="social-links">
            <a href="#facebook">f</a>
            <a href="#twitter">𝕏</a>
            <a href="#instagram">📷</a>
            <a href="#linkedin">in</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Anon Store. All Rights Reserved.</p>
        <div className="payment-methods">
          <img src="/images/visa.png" alt="Visa" />
          <img src="/images/mastercard.png" alt="Mastercard" />
          <img src="/images/paypal.png" alt="PayPal" />
          <img src="/images/amex.png" alt="Amex" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
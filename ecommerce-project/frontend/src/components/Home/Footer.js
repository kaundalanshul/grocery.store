// Footer Component — premium design, no broken image imports
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>MegaMart</h3>
          <p>The ultimate multi-category marketplace. From groceries to furniture, everything you need delivered to your door.</p>
        </div>

        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            <li><Link to="/category/Grocery">Grocery</Link></li>
            <li><Link to="/category/Apparel">Apparel</Link></li>
            <li><Link to="/category/Furniture">Furniture</Link></li>
            <li><Link to="/category/Books">Books</Link></li>
            <li><Link to="/products">All Products</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <p>📧 support@megamart.com</p>
          <p>📞 1-800-MEGAMART</p>
          <div className="social-links" style={{ marginTop: '12px' }}>
            <a href="#facebook" aria-label="Facebook">f</a>
            <a href="#twitter" aria-label="Twitter">𝕏</a>
            <a href="#instagram" aria-label="Instagram">📷</a>
            <a href="#linkedin" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} MegaMart. All Rights Reserved.</p>
        <div className="payment-methods">
          <span>We Accept: </span>
          <span className="payment-pill">Visa</span>
          <span className="payment-pill">Mastercard</span>
          <span className="payment-pill">PayPal</span>
          <span className="payment-pill">Stripe</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
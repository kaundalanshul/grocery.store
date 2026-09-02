import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderTracking from './pages/OrderTracking';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CategoryProducts from './pages/CategoryProducts';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import './App.css';

// Helper component for protecting routes that require authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Helper component to redirect authenticated users away from public-only routes
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <LanguageProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="App">
              <Routes>
                <Route path="/" element={<ProtectedRoute><Home theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="/login" element={<PublicRoute><Login theme={theme} onToggleTheme={toggleTheme} /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register theme={theme} onToggleTheme={toggleTheme} /></PublicRoute>} />
                <Route path="/order-tracking" element={<ProtectedRoute><OrderTracking theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="/products/:productId" element={<ProtectedRoute><ProductDetails theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="/category/:categoryName" element={<ProtectedRoute><CategoryProducts theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><Payment theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </LanguageProvider>
  );
}

export default App;
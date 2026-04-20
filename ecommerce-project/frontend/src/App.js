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
import CornerAnimation from './components/CornerAnimation';
import './App.css';

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
      <CartProvider>
        <BrowserRouter>
          <CornerAnimation />
          <div className="App">
          <Routes>
            <Route path="/" element={<Home theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/products" element={<Products theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/products/:productId" element={<ProductDetails theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/category/:categoryName" element={<CategoryProducts theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/cart" element={<Cart theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
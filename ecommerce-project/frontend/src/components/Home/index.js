// Home Page — Myntra-style E-Commerce Experience
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationBar } from './NavigationBar';
import { CategoryStories } from './CategoryStories';
import { PromoStrip } from './PromoStrip';
import { HeroBanner } from './HeroBanner';
import { TrendGrid } from './TrendGrid';
import { CategorySidebar } from './CategorySidebar';
import { BestSellers } from './BestSellers';
import { NewProducts } from './NewProducts';
import { RecentlyViewed } from './RecentlyViewed';
import { ServicesSection } from './ServicesSection';
import { Footer } from './Footer';
import '../../styles/home.css';

export const HomePage = ({ theme, onToggleTheme }) => {
  return (
    <div className="home-page myntra-themed-page">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />

      <div className="home-container">
        <CategorySidebar />

        <main className="main-content">
          {/* 1. Category Stories Squircles */}
          <CategoryStories />

          {/* 2. Flat ₹300 Off Coupon Strip */}
          <PromoStrip />

          {/* 3. Hero Carousel Banner (Big Brands Bash) */}
          <HeroBanner />

          {/* 4. Trending Subcategories Grid */}
          <TrendGrid />

          {/* 5. Curated Best Sellers & New Products */}
          <BestSellers />
          <NewProducts />
          <RecentlyViewed />
          <ServicesSection />
        </main>
      </div>

      {/* Floating Explore Pill Button */}
      <Link to="/products" className="floating-xplore-pill" title="Explore All Products">
        <span className="xplore-icon">⚡</span>
        <span className="xplore-text">XPLORE</span>
      </Link>

      <Footer />
    </div>
  );
};

export default HomePage;
// Home Page
// Main landing page combining all sections

import React from 'react';
import { NavigationBar } from './NavigationBar';
import { HeroBanner } from './HeroBanner';
import { CategorySidebar } from './CategorySidebar';
import { BestSellers } from './BestSellers';
import { DealOfTheDay } from './DealOfTheDay';
import { NewProducts } from './NewProducts';
import { ServicesSection } from './ServicesSection';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';
import '../../styles/home.css';

export const HomePage = ({ theme, onToggleTheme }) => {
  return (
    <div className="home-page">
      <NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
      
      <div className="home-container">
        <CategorySidebar />
        
        <main className="main-content">
          <HeroBanner />
          <BestSellers />
          <DealOfTheDay />
          <NewProducts />
          <ServicesSection />
          <Testimonials />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
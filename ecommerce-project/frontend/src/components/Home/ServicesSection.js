// Services Section Component
// Highlights key services like delivery, returns, support

import React from 'react';

export const ServicesSection = () => {
  const services = [
    {
      icon: '🚚',
      title: 'Worldwide Delivery',
      description: 'For Orders Over $100'
    },
    {
      icon: '↩️',
      title: 'Hassle-Free Return',
      description: '30-Day Easy Returns'
    },
    {
      icon: '👥',
      title: 'Expert Customer Support',
      description: '24/7 Available Support'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Protected Transactions'
    }
  ];

  return (
    <section className="services-section">
      <h2>Our Services</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
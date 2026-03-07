// Testimonials Component
// Customer reviews and testimonials section

import React from 'react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'Alan Doe',
      title: 'CEO & Founder Division',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/images/avatar-alan.jpg',
      rating: 4.5
    },
  ];

  return (
    <section className="testimonials">
      <h2>Customer Testimonials</h2>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-image">
              <img src={testimonial.image} alt={testimonial.name} />
            </div>
            <div className="testimonial-content">
              <div className="rating">{'⭐'.repeat(Math.floor(testimonial.rating))}</div>
              <p className="text">"{testimonial.text}"</p>
              <h4>{testimonial.name}</h4>
              <p className="title">{testimonial.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
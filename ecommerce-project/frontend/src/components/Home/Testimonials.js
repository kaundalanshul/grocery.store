// Testimonials Component — 3 cards with Unsplash avatar images
import React from 'react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'Fashion Blogger',
      text: 'Absolutely love the quality! The clothes fit perfectly and the delivery was super fast. Will definitely order again.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      title: 'Software Engineer',
      text: 'Great experience from start to finish. Product quality exceeded my expectations. The leather jacket is stunning!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      title: 'Interior Designer',
      text: 'Reliable shop with genuine products. Customer support was helpful when I needed to exchange sizes. Highly recommend!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      rating: 4,
    },
  ];

  return (
    <section className="testimonials">
      <h2>Customer Reviews</h2>
      <div className="testimonials-container">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-image">
              <img
                src={t.image}
                alt={t.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=2563eb&color=fff&size=70`;
                }}
              />
            </div>
            <div className="testimonial-rating">{'⭐'.repeat(t.rating)}</div>
            <p className="testimonial-text">"{t.text}"</p>
            <p className="testimonial-name">{t.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
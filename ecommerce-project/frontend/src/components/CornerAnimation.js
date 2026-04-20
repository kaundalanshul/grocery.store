import React from 'react';
import '../styles/cornerAnimation.css';

const CornerAnimation = () => {
  return (
    <div className="corner-animations">
      {/* Top-Left Corner */}
      <div className="corner-top-left">
        <div className="corner-slide-tl"></div>
      </div>

      {/* Top-Right Corner */}
      <div className="corner-top-right">
        <div className="corner-slide-tr"></div>
      </div>

      {/* Bottom-Left Corner */}
      <div className="corner-bottom-left">
        <div className="corner-slide-bl"></div>
      </div>

      {/* Bottom-Right Corner */}
      <div className="corner-bottom-right">
        <div className="corner-slide-br"></div>
      </div>
    </div>
  );
};

export default CornerAnimation;

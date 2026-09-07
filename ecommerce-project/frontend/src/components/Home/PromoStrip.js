// Promotional Offer Strip — Flat ₹300 Off coupon banner
import React, { useState } from 'react';

export const PromoStrip = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText('MEGAMART300');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="promo-coupon-strip" onClick={handleCopy} title="Tap to copy coupon code">
      <div className="promo-left">
        <span className="sparkle-icon">✨</span>
        <span className="promo-headline">Flat ₹300 Off</span>
      </div>
      <div className="promo-right">
        <span className="promo-use-label">USE CODE:</span>
        <span className="promo-code-box">
          {copied ? '✓ COPIED!' : 'MEGAMART300'}
        </span>
        <span className="sparkle-icon">✨</span>
      </div>
    </div>
  );
};

export default PromoStrip;

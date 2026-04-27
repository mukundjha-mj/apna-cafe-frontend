import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import promoImg from '../assets/food/promo-banner.png';

export default function PromoBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('FIRST50').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="promo-banner" id="promo-banner">
      <img src={promoImg} alt="Delicious food at Apna Cafe" />
      <div className="promo-banner-overlay">
        <div className="promo-banner-title">
          Get <span style={{ color: '#FFD700' }}>50% Off</span> Your<br />First Order!
        </div>
        <div className="promo-banner-code">
          <span>FIRST50</span>
          <button className="promo-code-btn" onClick={handleCopy}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

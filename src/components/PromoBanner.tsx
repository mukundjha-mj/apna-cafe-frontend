import promoImg from '../assets/food/grand_opening_banner.png';

export default function PromoBanner() {
  return (
    <div className="promo-banner grand-opening" id="promo-banner">
      <img src={promoImg} alt="Grand Opening at Apna Cafe" />
    </div>
  );
}

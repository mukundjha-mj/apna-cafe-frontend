import { ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';

export default function ViewCartBar() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Spacer to prevent cart bar from overlapping last content */}
      <div className="view-cart-spacer" aria-hidden="true" />
      <div
        className="view-cart-bar"
        id="view-cart-bar"
        onClick={() => navigate('/cart')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') navigate('/cart'); }}
      >
        <div className="view-cart-bar-left">
          <ShoppingBag size={18} />
          <span className="view-cart-bar-count">{totalItems} items</span>
          <span>View Cart</span>
        </div>
        <span className="view-cart-bar-price">₹{totalPrice}</span>
      </div>
    </>
  );
}

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { removeItem, updateQuantity } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { selectBestsellers } from '../store/menuSlice';
import MenuItemCard from '../components/MenuItemCard';

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bestsellers = useSelector(selectBestsellers);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const serviceFee = subtotal > 0 ? 10 : 0;
  const discount = subtotal >= 200 ? -50 : 0;
  const total = subtotal + deliveryFee + serviceFee + discount;

  const suggestions = bestsellers.filter(
    bs => !cartItems.find(ci => ci.id === bs.id)
  ).slice(0, 4);

  if (cartItems.length === 0) {
    return (
      <div className="page animate-fade-in" id="cart-page-empty">
        <div style={{ padding: '1rem 0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="page-header-icon" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={20} /></button>
            <h2 style={{ margin: 0 }}>My Cart</h2>
          </div>
        </div>
        <div className="text-center" style={{ padding: '4rem 0', color: 'var(--typo-200)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <ShoppingBag size={36} color="var(--primary-300)" />
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--typo-400)', marginBottom: '0.25rem' }}>Your cart is empty</p>
          <p style={{ fontSize: '0.8rem', marginBottom: '1.5rem' }}>Add some delicious items from the menu!</p>
          <button className="btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" id="cart-page">
      <div style={{ padding: '1rem 0 0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="page-header-icon" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={20} /></button>
          <h2 style={{ margin: 0 }}>My Cart</h2>
        </div>
      </div>
      <div className="stack" style={{ marginBottom: '1.25rem' }}>
        {cartItems.map(item => (
          <div key={`${item.id}-${item.size || ''}`} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: 75, height: 75, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} />}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                {item.size && <span style={{ fontSize: '0.7rem', color: 'var(--typo-200)' }}>{item.size}</span>}
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-300)', marginTop: '0.15rem' }}>₹{item.price * item.quantity}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity - 1 }))}><Minus size={14} /></button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))}><Plus size={14} /></button>
                </div>
                <button className="btn-ghost" onClick={() => dispatch(removeItem({ id: item.id, size: item.size }))} style={{ color: 'var(--danger)', padding: '0.25rem' }} aria-label="Remove item"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {suggestions.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="section-header"><span className="section-title" style={{ fontSize: '0.95rem' }}>You might also like</span></div>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '0.5rem' }}>
            {suggestions.map(item => (
              <div key={item.id} style={{ minWidth: '150px', flex: '0 0 150px' }}><MenuItemCard item={item} layout="grid" /></div>
            ))}
          </div>
        </div>
      )}
      <div className="payment-summary" style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Payment summary</h4>
        <div className="payment-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
        {discount !== 0 && <div className="payment-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>{discount}</span></div>}
        <div className="payment-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
        <div className="payment-row"><span>Service Fee</span><span>₹{serviceFee}</span></div>
        <div className="payment-row total"><span>Total</span><span style={{ color: 'var(--primary-300)' }}>₹{total}</span></div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button className="btn-outline btn-lg" style={{ flex: 1 }} onClick={() => navigate('/menu')}>Add Items</button>
        <button className="btn-primary btn-lg" style={{ flex: 1 }} onClick={() => navigate('/checkout')}>Checkout</button>
      </div>
    </div>
  );
};

export default Cart;

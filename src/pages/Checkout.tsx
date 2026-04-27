import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { placeOrder } from '../store/ordersSlice';
import { ArrowLeft, MapPin, Clock, Banknote, CreditCard } from 'lucide-react';
import OrderSuccessModal from '../components/OrderSuccessModal';

export default function Checkout() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const cafeId = useSelector((state: RootState) => state.menu.cafeId);
  const cafeName = useSelector((state: RootState) => state.menu.cafeName);
  const placing = useSelector((state: RootState) => state.orders.placing);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 0;
  const serviceFee = 0;
  const discount = 0; // Removed discount logic as well if not needed, or keep it 0
  const total = subtotal + deliveryFee + serviceFee + discount;

  const handlePlaceOrder = async () => {
    if (!user || !cafeId) return;
    const result = await dispatch(placeOrder({
      userId: user.id,
      cafeId,
      type: 'PICKUP',
      paymentMethod,
      subtotal,
      deliveryFee,
      serviceFee,
      discount,
      totalAmount: total,
      items: cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
    }));
    if (placeOrder.fulfilled.match(result)) {
      setOrderId(result.payload.id);
      setShowSuccess(true);
    }
  };

  if (cartItems.length === 0 && !showSuccess) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page animate-fade-in" id="checkout-page">
      <div style={{ padding: '1rem 0 0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="page-header-icon" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={20} /></button>
          <h2 style={{ margin: 0 }}>Checkout</h2>
        </div>
      </div>
      <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--typo-200)' }}>Deliver to</span>
          <button className="btn-ghost" style={{ color: 'var(--primary-300)', fontSize: '0.75rem', fontWeight: 600 }}>Change</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <MapPin size={18} color="var(--primary-300)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pickup from {cafeName || 'Cafe'}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--typo-200)' }}>Your order will be ready for pickup</div>
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '0.75rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--primary-300)" />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--typo-200)' }}>Delivery</div>
            <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>Ready in approx. 20 mins</div>
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.65rem' }}>Payment Method:</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setPaymentMethod('cash')} style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-md)', border: paymentMethod === 'cash' ? '2px solid var(--primary-300)' : '1.5px solid var(--bg-200)', background: paymentMethod === 'cash' ? 'var(--primary-100)' : 'var(--bg-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: paymentMethod === 'cash' ? 600 : 400, color: paymentMethod === 'cash' ? 'var(--primary-300)' : 'var(--typo-300)' }}>
            <Banknote size={16} /> Cash
          </button>
          <button onClick={() => setPaymentMethod('card')} style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-md)', border: paymentMethod === 'card' ? '2px solid var(--primary-300)' : '1.5px solid var(--bg-200)', background: paymentMethod === 'card' ? 'var(--primary-100)' : 'var(--bg-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: paymentMethod === 'card' ? 600 : 400, color: paymentMethod === 'card' ? 'var(--primary-300)' : 'var(--typo-300)' }}>
            <CreditCard size={16} /> Card
          </button>
        </div>
      </div>
      <div className="payment-summary" style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Payment summary</h4>
        <div className="payment-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
        {discount > 0 && <div className="payment-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>-{discount}</span></div>}
        {deliveryFee > 0 && <div className="payment-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>}
        {serviceFee > 0 && <div className="payment-row"><span>Service Fee</span><span>₹{serviceFee}</span></div>}
        <div className="payment-row total"><span>Total</span><span style={{ color: 'var(--primary-300)' }}>₹{total}</span></div>
      </div>
      <button className="btn-primary btn-full btn-lg" onClick={handlePlaceOrder} disabled={placing} style={{ marginBottom: '1rem', opacity: placing ? 0.7 : 1, borderRadius: 'var(--radius-lg)' }}>
        {placing ? 'Placing Order...' : 'Place order'}
      </button>
      {showSuccess && (
        <OrderSuccessModal
          onClose={() => { dispatch(clearCart()); setShowSuccess(false); navigate('/orders'); }}
          onTrackOrder={() => { dispatch(clearCart()); setShowSuccess(false); navigate(`/order/${orderId}`); }}
          estimatedTime="20mins"
          deliverTo="Pickup"
          amountPaid={total}
        />
      )}
    </div>
  );
}

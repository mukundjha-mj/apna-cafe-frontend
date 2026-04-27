import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Banknote, CreditCard, Utensils, ShoppingBag, Truck, Navigation, CheckCircle2 } from 'lucide-react';
import type { RootState, AppDispatch } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { placeOrder } from '../store/ordersSlice';
import { getCurrentPosition, reverseGeocode } from '../lib/geo';
import { setAuthModalOpen } from '../store/authSlice';
import OrderSuccessModal from '../components/OrderSuccessModal';

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Selectors
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const { cafeId, orderType } = useSelector((state: RootState) => state.menu);
  const placing = useSelector((state: RootState) => state.orders.placing);

  // State
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [tableNumber, setTableNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'DELIVERY' ? 0 : 0; // Keeping fees 0 as per previous request
  const total = subtotal + deliveryFee;

  // Sync address from profile if exists
  useEffect(() => {
    // If we had address in profile, we'd set it here. 
    // For now, we'll fetch via geolocation if it's DELIVERY and empty.
  }, [user]);

  const handleLocate = async () => {
    setIsLocating(true);
    try {
      const pos = await getCurrentPosition();
      const res = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      if (res) {
        setAddress(res.display_name);
      }
    } catch (err) {
      console.error(err);
      alert('Could not detect location. Please enter manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      dispatch(setAuthModalOpen(true));
      return;
    }

    if (!cafeId || !orderType) return;
    
    if (orderType === 'DELIVERY' && !address.trim()) {
      alert('Please provide a delivery address');
      return;
    }

    const result = await dispatch(placeOrder({
      userId: user.id,
      cafeId,
      type: orderType as any,
      tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
      address: orderType === 'DELIVERY' ? address : undefined,
      paymentMethod: paymentMethod === 'upi' ? 'card' : paymentMethod, // mapping to backend types
      subtotal,
      deliveryFee,
      serviceFee: 0,
      discount: 0,
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
      <div className="checkout-header">
        <button className="page-header-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2>Checkout</h2>
      </div>

      <div className="checkout-content">
        {/* Order Type Header */}
        <div className="order-type-badge">
          {orderType === 'DINE_IN' && <><Utensils size={16} /> Dine In</>}
          {orderType === 'TAKEAWAY' && <><ShoppingBag size={16} /> Takeaway</>}
          {orderType === 'DELIVERY' && <><Truck size={16} /> Delivery</>}
        </div>

        {/* Dynamic Section Based on Type */}
        {orderType === 'DINE_IN' && (
          <div className="checkout-section">
            <h4 className="section-label">Table Information</h4>
            <div className="input-group">
              <Utensils size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Table Number (Optional)" 
                className="input"
                value={tableNumber}
                onChange={e => setTableNumber(e.target.value)}
              />
            </div>
            <p className="helper-text">Or you can tell the staff when you arrive.</p>
          </div>
        )}

        {orderType === 'TAKEAWAY' && (
          <div className="checkout-section">
            <h4 className="section-label">Pickup Details</h4>
            <div className="info-card">
              <Clock size={20} className="info-icon" />
              <div>
                <p className="info-title">Pickup Time</p>
                <p className="info-desc">Ready in approx. 15-20 mins</p>
              </div>
            </div>
          </div>
        )}

        {orderType === 'DELIVERY' && (
          <div className="checkout-section">
            <h4 className="section-label">Delivery Address</h4>
            <div className="address-box">
              <textarea 
                className="input" 
                placeholder="Flat / House No, Street, Landmark..."
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <button 
                className="locate-btn" 
                onClick={handleLocate}
                disabled={isLocating}
              >
                {isLocating ? 'Locating...' : <><Navigation size={14} /> Detect My Location</>}
              </button>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="checkout-section">
          <h4 className="section-label">Payment Method</h4>
          <div className="payment-grid">
            {orderType !== 'DELIVERY' && (
              <button 
                className={`payment-card ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote size={20} />
                <span>Pay at Counter</span>
                {paymentMethod === 'cash' && <CheckCircle2 size={16} className="active-check" />}
              </button>
            )}
            <button 
              className={`payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <CreditCard size={20} />
              <span>Pay via App</span>
              {paymentMethod === 'upi' && <CheckCircle2 size={16} className="active-check" />}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-section">
          <h4 className="section-label">Bill Details</h4>
          <div className="bill-card">
            <div className="bill-row">
              <span>Item Total</span>
              <span>₹{subtotal}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
            )}
            <div className="bill-row total">
              <span>To Pay</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        <button 
          className="btn-primary btn-full btn-lg place-order-btn"
          onClick={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? 'Placing Order...' : `Place ${orderType === 'DELIVERY' ? 'Delivery' : 'Order'}`}
        </button>
      </div>


      <style>{`
        #checkout-page {
          background: var(--bg-dark);
          min-height: 100vh;
        }
        .checkout-header {
          padding: 1.5rem 1.25rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .checkout-content {
          padding: 0 1.25rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .order-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary-glow);
          color: var(--primary);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          width: fit-content;
          border: 1px solid rgba(186, 117, 23, 0.2);
        }
        .checkout-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .section-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }
        .info-card {
          background: var(--bg-card);
          padding: 1rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .info-icon {
          color: var(--primary);
        }
        .info-title {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .info-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .address-box {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .locate-btn {
          background: transparent;
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0;
          width: fit-content;
        }
        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .payment-card {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.25rem 1rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          position: relative;
          transition: all 0.3s;
          color: var(--text-muted);
        }
        .payment-card.active {
          border-color: var(--primary);
          background: var(--primary-glow);
          color: var(--primary);
        }
        .active-check {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
        }
        .payment-card span {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .bill-card {
          background: var(--bg-card);
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border: 1px dashed rgba(255, 255, 255, 0.1);
        }
        .bill-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .bill-row.total {
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-cream);
          font-weight: 800;
          font-size: 1.1rem;
        }
        .place-order-btn {
          margin-top: 1rem;
          height: 56px;
        }
        .helper-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          padding-left: 0.25rem;
        }
      `}</style>
      <OrderSuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          dispatch(clearCart());
          navigate('/');
        }}
        onTrackOrder={() => {
          setShowSuccess(false);
          dispatch(clearCart());
          navigate(`/order/${orderId}`);
        }}
        orderId={orderId || ''}
        amountPaid={total}
        deliverTo={orderType === 'DELIVERY' ? address : (orderType === 'DINE_IN' ? `Table ${tableNumber}` : 'Cafe')}
      />
    </div>
  );
}

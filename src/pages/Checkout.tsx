import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Banknote, Utensils, ShoppingBag, Truck, CheckCircle2, Wallet as WalletIcon } from 'lucide-react';
import type { RootState, AppDispatch } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { placeOrder } from '../store/ordersSlice';
import { setAuthModalOpen } from '../store/authSlice';
import OrderSuccessModal from '../components/OrderSuccessModal';
import AddAddressModal from '../components/AddAddressModal';
import { API_URL } from '../lib/api';

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Selectors
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const { cafeId, orderType } = useSelector((state: RootState) => state.menu);
  const placing = useSelector((state: RootState) => state.orders.placing);

  // State
  const [tableNumber, setTableNumber] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const deliveryFeeBase = Number(import.meta.env.VITE_DELIVERY_FEE) || 30;
  const serviceFeeBase = Number(import.meta.env.VITE_SERVICE_FEE) || 10;

  // Totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'DELIVERY' && subtotal > 0 ? deliveryFeeBase : 0;
  const serviceFee = orderType === 'DELIVERY' && subtotal > 0 ? serviceFeeBase : 0;
  const walletAmountToUse = useWallet ? Math.min(walletBalance, subtotal + deliveryFee + serviceFee) : 0;
  const total = subtotal + deliveryFee + serviceFee - walletAmountToUse;

  // Fetch wallet balance
  useEffect(() => {
    if (user?.id) {
      fetch(`${API_URL}/api/wallet/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setWalletBalance(data.data.balance);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/addresses/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
        if (data.data.length > 0 && !selectedAddress) {
          const defaultAddr = data.data.find((a: any) => a.isDefault) || data.data[0];
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  // Sync address from profile if exists
  useEffect(() => {
    if (orderType === 'DELIVERY') {
      fetchAddresses();
    }
  }, [user, orderType]);

  const handleSaveAddress = async (newAddr: any) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/addresses/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr)
      });
      const data = await res.json();
      if (data.success) {
        setAddresses([...addresses, data.data]);
        setSelectedAddress(data.data);
      }
    } catch (err) {
      console.error('Failed to save address', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      dispatch(setAuthModalOpen(true));
      return;
    }

    const finalCafeId = cafeId || (cartItems.length > 0 ? cartItems[0].cafeId : null);
    
    if (!finalCafeId || !orderType) return;
    
    if (orderType === 'DELIVERY' && !selectedAddress) {
      alert('Please provide a delivery address');
      return;
    }

    const result = await dispatch(placeOrder({
      userId: user.id,
      cafeId: finalCafeId,
      type: orderType as any,
      tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
      address: orderType === 'DELIVERY' ? `${selectedAddress.type} - ${selectedAddress.address}` : undefined,
      paymentMethod: 'cash',
      subtotal,
      deliveryFee,
      serviceFee,
      discount: walletAmountToUse,
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

  useEffect(() => {
    if (cartItems.length === 0 && !showSuccess) {
      navigate('/cart', { replace: true });
    }
  }, [cartItems.length, showSuccess, navigate]);

  if (cartItems.length === 0 && !showSuccess) {
    return null;
  }

  return (
    <div className="page animate-fade-in" id="checkout-page">
      <AddAddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
      />
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
            <div className="address-box" style={{ background: 'transparent', padding: 0, border: 'none' }}>
              {addresses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <select 
                    className="input" 
                    value={selectedAddress?.id || ''} 
                    onChange={e => {
                      const addr = addresses.find(a => a.id === e.target.value);
                      if (addr) setSelectedAddress(addr);
                    }}
                    style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-cream)', borderRadius: 'var(--radius-md)', appearance: 'none' }}
                  >
                    {addresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.type} - {addr.address}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn-outline" 
                    onClick={() => setIsAddressModalOpen(true)}
                    style={{ padding: '0.75rem', fontSize: '0.85rem' }}
                  >
                    + Add New Address
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No saved addresses found.</p>
                  <button 
                    className="btn-primary" 
                    onClick={() => setIsAddressModalOpen(true)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    Add Delivery Address
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wallet Balance */}
        {walletBalance > 0 && (
          <div className="checkout-section">
            <h4 className="section-label">Wallet Rewards</h4>
            <div className="wallet-card-checkout" onClick={() => setUseWallet(!useWallet)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="wallet-icon-box"><WalletIcon size={18} /></div>
                <div>
                  <p className="wallet-title">Use Wallet Balance</p>
                  <p className="wallet-balance-text">Available: ₹{walletBalance}</p>
                </div>
              </div>
              <div className={`wallet-toggle ${useWallet ? 'active' : ''}`}>
                <div className="toggle-dot"></div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="checkout-section">
          <h4 className="section-label">Payment Method</h4>
          <div className="payment-grid">
            {orderType !== 'DELIVERY' ? (
              <button className="payment-card active">
                <Banknote size={20} />
                <span>Pay at Counter</span>
                <CheckCircle2 size={16} className="active-check" />
              </button>
            ) : (
              <button className="payment-card active">
                <Banknote size={20} />
                <span>Pay on Delivery</span>
                <CheckCircle2 size={16} className="active-check" />
              </button>
            )}
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
            {serviceFee > 0 && (
              <div className="bill-row">
                <span>Service Fee</span>
                <span>₹{serviceFee}</span>
              </div>
            )}
            {walletAmountToUse > 0 && (
              <div className="bill-row" style={{ color: '#22c55e' }}>
                <span>Wallet Discount</span>
                <span>-₹{walletAmountToUse}</span>
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
        .wallet-card-checkout {
          background: var(--bg-card);
          border: 1px solid rgba(34, 197, 94, 0.2);
          padding: 1rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.3s;
        }
        .wallet-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wallet-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-cream);
        }
        .wallet-balance-text {
          font-size: 0.7rem;
          color: #22c55e;
          font-weight: 600;
        }
        .wallet-toggle {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          position: relative;
          transition: all 0.3s;
        }
        .wallet-toggle.active {
          background: #22c55e;
        }
        .toggle-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: all 0.3s;
        }
        .wallet-toggle.active .toggle-dot {
          left: 23px;
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
        deliverTo={orderType === 'DELIVERY' && selectedAddress ? `${selectedAddress.type} - ${selectedAddress.address}` : (orderType === 'DINE_IN' ? `Table ${tableNumber}` : 'Cafe')}
      />
    </div>
  );
}

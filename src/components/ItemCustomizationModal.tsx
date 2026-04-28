import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../store/menuSlice';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

interface ItemCustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemCustomizationModal({ item, isOpen, onClose }: ItemCustomizationModalProps) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const sizes = item?.sizes as { label: string; price: number }[] | null;

  useEffect(() => {
    if (item && sizes && sizes.length > 0) {
      setSelectedSize(sizes[0].label);
    }
    setQuantity(1);
  }, [item, sizes]);

  if (!isOpen || !item) return null;

  const currentSizePrice = sizes?.find(s => s.label === selectedSize)?.price ?? item.price;
  const totalPrice = currentSizePrice * quantity;

  const handleAddToCart = () => {
    dispatch(addItem({
      id: item.id,
      name: item.name,
      price: currentSizePrice,
      quantity: quantity,
      cafeId: item.cafeId,
      imageUrl: item.imageUrl,
      size: selectedSize || undefined,
    }));
    onClose();
  };

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
        <button className="custom-close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="custom-modal-header">
          <img src={item.imageUrl} alt={item.name} className="custom-item-img" />
          <div className="custom-item-info">
            <div className="veg-non-veg-badge">
              <div className={`diet-icon ${item.isVeg ? 'veg' : 'non-veg'}`}>
                <div className="diet-dot" />
              </div>
            </div>
            <h3>{item.name}</h3>
          </div>
        </div>

        <div className="custom-modal-body">
          {sizes && sizes.length > 0 && (
            <div className="custom-section">
              <div className="section-title-box">
                <h4>Size</h4>
                <span className="required-tag">REQUIRED</span>
              </div>
              <div className="options-list">
                {sizes.map((s) => (
                  <label key={s.label} className={`option-item ${selectedSize === s.label ? 'selected' : ''}`}>
                    <div className="option-left">
                      <div className={`diet-icon ${item.isVeg ? 'veg' : 'non-veg'}`}>
                        <div className="diet-dot" />
                      </div>
                      <span className="option-label">{s.label}</span>
                    </div>
                    <div className="option-right">
                      <span className="option-price">₹{s.price}</span>
                      <input 
                        type="radio" 
                        name="item-size" 
                        checked={selectedSize === s.label}
                        onChange={() => setSelectedSize(s.label)}
                      />
                      <div className="custom-radio" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="custom-modal-footer">
          <div className="qty-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <span>Add Item | ₹{totalPrice}</span>
          </button>
        </div>
      </div>

      <style>{`
        .custom-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          padding: 1.5rem;
        }
        .custom-modal-content {
          background: #FFFFFF;
          width: 100%;
          max-width: 400px;
          border-radius: 28px;
          padding: 1.75rem;
          position: relative;
          animation: modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          color: #2D2D2D;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .custom-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #F5F5F5;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          color: #666;
        }
        .custom-modal-header {
          display: flex;
          gap: 1rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #F0F0F0;
        }
        .custom-item-img {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          object-fit: cover;
        }
        .custom-item-info h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-top: 0.25rem;
        }
        .diet-icon {
          width: 16px;
          height: 16px;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .diet-icon.veg { border-color: #008444; }
        .diet-icon.non-veg { border-color: #B22222; }
        .diet-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .veg .diet-dot { background: #008444; }
        .non-veg .diet-dot { background: #B22222; }

        .custom-modal-body {
          max-height: 60vh;
          overflow-y: auto;
          padding: 1.25rem 0;
        }
        .section-title-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .section-title-box h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #1A1A1A;
        }
        .required-tag {
          font-size: 0.6rem;
          font-weight: 800;
          color: #666;
          background: #F0F0F0;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border: 1px solid #EFEFEF;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .option-item.selected {
          border-color: #BA7517;
          background: rgba(186, 117, 23, 0.03);
        }
        .option-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .option-label {
          font-weight: 600;
          color: #333;
        }
        .option-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .option-price {
          font-weight: 700;
          color: #1A1A1A;
        }
        .option-item input {
          display: none;
        }
        .custom-radio {
          width: 20px;
          height: 20px;
          border: 2px solid #DDD;
          border-radius: 50%;
          position: relative;
        }
        .option-item.selected .custom-radio {
          border-color: #BA7517;
        }
        .option-item.selected .custom-radio::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: #BA7517;
          border-radius: 50%;
        }

        .custom-modal-footer {
          padding-top: 1.25rem;
          display: flex;
          gap: 1rem;
          border-top: 1px solid #F0F0F0;
        }
        .qty-selector {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: #F5F5F5;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-weight: 800;
        }
        .qty-selector button {
          color: #BA7517;
          background: transparent;
          padding: 0;
        }
        .add-to-cart-btn {
          flex: 1;
          background: #008444; /* Swiggy Green */
          color: #FFF;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          padding: 0.85rem;
        }
      `}</style>
    </div>
  );
}

import { Heart, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeItem } from '../store/cartSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import type { RootState } from '../store/store';
import type { MenuItem } from '../store/menuSlice';
import { useState } from 'react';
import ItemCustomizationModal from './ItemCustomizationModal';

interface MenuItemCardProps {
  item: MenuItem;
  layout?: 'list' | 'grid';
}

export default function MenuItemCard({ item, layout = 'list' }: MenuItemCardProps) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.itemIds);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isFav = favorites.includes(item.id);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // For display in card, we show the base price or the first size price
  const sizes = item.sizes as { label: string; price: number }[] | null;
  const basePrice = sizes ? sizes[0].price : item.price;

  // Check if item is in cart (any size)
  const itemInCart = cartItems.filter(ci => ci.id === item.id);
  const totalQty = itemInCart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCustomizing(true);
  };

  const handleQtyChange = (e: React.MouseEvent, increment: boolean) => {
    e.stopPropagation();
    if (itemInCart.length > 1) {
      // If multiple sizes exist in cart, we open modal to manage them or just show "customized"
      setIsCustomizing(true);
      return;
    }
    
    if (itemInCart.length === 1) {
      const current = itemInCart[0];
      const newQty = increment ? current.quantity + 1 : current.quantity - 1;
      if (newQty === 0) {
        dispatch(removeItem({ id: current.id, size: current.size }));
      } else {
        dispatch(updateQuantity({ id: current.id, size: current.size, quantity: newQty }));
      }
    }
  };

  if (layout === 'grid') {
    return (
      <>
        <div className="grid-card" onClick={() => setIsCustomizing(true)}>
          <div className="grid-card-img-container">
            <img src={item.image} alt={item.name} className="grid-card-img" loading="lazy" />
            <button 
              onClick={(e) => { e.stopPropagation(); dispatch(toggleFavorite(item.id)); }} 
              className="fav-btn-overlay"
            >
              <Heart size={14} fill={isFav ? '#FF7622' : 'none'} color={isFav ? '#FF7622' : '#91958E'} />
            </button>
          </div>
          <div className="grid-card-body">
            <div className="grid-card-name">{item.name}</div>
            <div className="grid-card-footer">
              <span className="grid-card-price">₹{basePrice}</span>
              {totalQty === 0 ? (
                <button className="add-btn" onClick={handleAddClick}><Plus size={16} /></button>
              ) : (
                <div className="qty-controls">
                  <button className="qty-btn" onClick={(e) => handleQtyChange(e, false)}><Minus size={14} /></button>
                  <span className="qty-value">{totalQty}</span>
                  <button className="qty-btn" onClick={(e) => handleQtyChange(e, true)}><Plus size={14} /></button>
                </div>
              )}
            </div>
          </div>
        </div>

        <ItemCustomizationModal 
          item={item} 
          isOpen={isCustomizing} 
          onClose={() => setIsCustomizing(false)} 
        />
      </>
    );
  }

  return (
    <>
      <div className="menu-card" onClick={() => setIsCustomizing(true)}>
        <div className="menu-card-img-wrapper">
          <img src={item.image} alt={item.name} className="menu-card-img" loading="lazy" />
          <div className="veg-indicator-card">
            <div className={`diet-icon-mini ${item.isVeg ? 'veg' : 'non-veg'}`}>
              <div className="diet-dot-mini" />
            </div>
          </div>
        </div>
        
        <div className="menu-card-info">
          <div className="menu-card-header">
            <div className="menu-card-name-row">
              <span className="menu-card-name">{item.name}</span>
              <button onClick={(e) => { e.stopPropagation(); dispatch(toggleFavorite(item.id)); }} className="btn-ghost fav-btn">
                <Heart size={18} fill={isFav ? '#FF7622' : 'none'} color={isFav ? '#FF7622' : '#B6B8B5'} />
              </button>
            </div>
            <div className="menu-card-desc">{item.description}</div>
          </div>
          
          <div className="menu-card-bottom">
            <span className="menu-card-price">₹{basePrice}</span>
            {totalQty === 0 ? (
              <button className="add-btn-outline" onClick={handleAddClick}>
                ADD <Plus size={14} style={{ marginLeft: '4px' }} />
              </button>
            ) : (
              <div className="qty-controls-rect">
                <button className="qty-btn" onClick={(e) => handleQtyChange(e, false)}><Minus size={14} /></button>
                <span className="qty-value">{totalQty}</span>
                <button className="qty-btn" onClick={(e) => handleQtyChange(e, true)}><Plus size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ItemCustomizationModal 
        item={item} 
        isOpen={isCustomizing} 
        onClose={() => setIsCustomizing(false)} 
      />

      <style>{`
        .grid-card {
          background: var(--bg-card);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .grid-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          border-color: var(--primary-glow);
        }
        .grid-card-img-container {
          position: relative;
          aspect-ratio: 1/1;
          width: 100%;
        }
        .grid-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fav-btn-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #FFFFFF !important;
          border-radius: 50% !important;
          width: 32px !important;
          height: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
          z-index: 5;
          padding: 0 !important;
        }
        .grid-card-body {
          padding: 0.85rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .grid-card-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-cream);
          margin-bottom: 0.5rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .grid-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .grid-card-price {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--text-cream);
        }
        .add-btn {
          background: var(--primary);
          color: #FFF;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px var(--primary-glow);
        }
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(186, 117, 23, 0.1);
          padding: 0.25rem 0.6rem;
          border-radius: 10px;
          border: 1px solid var(--primary-glow);
        }
        .qty-btn {
          color: var(--primary);
          background: transparent;
        }
        .qty-value {
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--text-cream);
        }

        /* List View Styles */
        .menu-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-card);
          border-radius: 16px;
          margin-bottom: 1rem;
          border: 1px solid rgba(255,255,255,0.03);
          transition: all 0.3s;
        }
        .menu-card:hover {
          border-color: var(--primary-glow);
          background: rgba(255,255,255,0.02);
        }
        .menu-card-img-wrapper {
          position: relative;
          flex-shrink: 0;
        }
        .menu-card-img {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          object-fit: cover;
        }
        .veg-indicator-card {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(255,255,255,0.9);
          padding: 2px;
          border-radius: 2px;
        }
        .diet-icon-mini {
          width: 12px;
          height: 12px;
          border: 1.5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1px;
        }
        .diet-icon-mini.veg { border-color: #008444; }
        .diet-icon-mini.non-veg { border-color: #B22222; }
        .diet-dot-mini {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .veg .diet-dot-mini { background: #008444; }
        .non-veg .diet-dot-mini { background: #B22222; }

        .menu-card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .menu-card-name-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .menu-card-name {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-cream);
        }
        .fav-btn {
          padding: 0;
          background: transparent;
          color: var(--text-muted);
        }
        .menu-card-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }
        .menu-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
        }
        .menu-card-price {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--text-cream);
        }
        .add-btn-outline {
          border: 1.5px solid var(--primary);
          color: var(--primary);
          background: transparent;
          padding: 0.4rem 1rem;
          font-size: 0.8rem;
          font-weight: 800;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .add-btn-outline:active {
          background: var(--primary);
          color: #FFF;
        }
        .qty-controls-rect {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: var(--primary);
          color: #FFF;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-weight: 800;
          box-shadow: 0 4px 12px var(--primary-glow);
        }
      `}</style>
    </>
  );
}

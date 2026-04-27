import { Heart, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateQuantity } from '../store/cartSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import type { RootState } from '../store/store';
import type { MenuItem } from '../store/menuSlice';
import { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
  layout?: 'list' | 'grid';
}

export default function MenuItemCard({ item, layout = 'list' }: MenuItemCardProps) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.itemIds);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isFav = favorites.includes(item.id);

  const sizes = item.sizes as { label: string; price: number }[] | null;
  const [selectedSize, setSelectedSize] = useState(
    sizes ? sizes[0].label : undefined
  );
  const currentPrice = sizes
    ? (sizes.find(s => s.label === selectedSize)?.price ?? item.price)
    : item.price;

  const cartItem = cartItems.find(
    ci => ci.id === item.id && ci.size === selectedSize
  );
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    dispatch(addItem({
      id: item.id,
      name: item.name,
      price: currentPrice,
      quantity: 1,
      cafeId: item.cafeId,
      image: item.image,
      size: selectedSize,
    }));
  };

  const handleQty = (newQty: number) => {
    dispatch(updateQuantity({ id: item.id, size: selectedSize, quantity: newQty }));
  };

  if (layout === 'grid') {
    return (
      <div className="grid-card" id={`menu-item-${item.id}`}>
        <div style={{ position: 'relative' }}>
          <img src={item.image} alt={item.name} className="grid-card-img" loading="lazy" />
          <button onClick={() => dispatch(toggleFavorite(item.id))} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart size={14} fill={isFav ? '#FF7622' : 'none'} color={isFav ? '#FF7622' : '#91958E'} />
          </button>
          {item.isBestseller && <span className="badge badge-primary" style={{ position: 'absolute', top: 8, left: 8 }}>🔥 Bestseller</span>}
          {item.isNew && <span className="badge badge-success" style={{ position: 'absolute', top: 8, left: 8 }}>✨ New</span>}
        </div>
        <div className="grid-card-body">
          <div className="grid-card-name">{item.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <span className="grid-card-price">₹{currentPrice}</span>
            {qty === 0 ? (
              <button className="add-btn" onClick={handleAdd} aria-label="Add to cart"><Plus size={16} /></button>
            ) : (
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => handleQty(qty - 1)}><Minus size={14} /></button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => handleQty(qty + 1)}><Plus size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-card" id={`menu-item-${item.id}`}>
      <img src={item.image} alt={item.name} className="menu-card-img" loading="lazy" />
      <div className="menu-card-info">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="menu-card-name" style={{ flex: 1 }}>{item.name}</span>
            <button onClick={() => dispatch(toggleFavorite(item.id))} className="btn-ghost" style={{ padding: '0.15rem', flexShrink: 0 }} aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
              <Heart size={16} fill={isFav ? '#FF7622' : 'none'} color={isFav ? '#FF7622' : '#B6B8B5'} />
            </button>
          </div>
          <div className="menu-card-desc">{item.description}</div>
          {sizes && (
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.2rem' }}>
              {sizes.map(s => (
                <button key={s.label} onClick={() => setSelectedSize(s.label)} style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', fontWeight: selectedSize === s.label ? 600 : 400, border: selectedSize === s.label ? '1.5px solid #FF7622' : '1px solid #DFDFDF', borderRadius: '6px', background: selectedSize === s.label ? '#FFF0E6' : 'transparent', color: selectedSize === s.label ? '#FF7622' : '#91958E', cursor: 'pointer' }}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="menu-card-bottom">
          <span className="menu-card-price">₹{currentPrice}</span>
          {qty === 0 ? (
            <button className="add-btn" onClick={handleAdd} aria-label="Add to cart"><Plus size={16} /></button>
          ) : (
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => handleQty(qty - 1)}><Minus size={14} /></button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" onClick={() => handleQty(qty + 1)}><Plus size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

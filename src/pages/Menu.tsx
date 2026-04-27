import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard';
import ViewCartBar from '../components/ViewCartBar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { addItem } from '../store/cartSlice';
import { selectAllMenuItems, selectComboItems } from '../store/menuSlice';
import { Plus, Minus } from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcons';


export default function Menu() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [activeCat, setActiveCat] = useState(initialCat);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const allMenuItems = useSelector(selectAllMenuItems);
  const comboItems = useSelector(selectComboItems);
  const cafeId = useSelector((state: RootState) => state.menu.cafeId);
  const menuLoading = useSelector((state: RootState) => state.menu.loading);

  const categories = useSelector((state: RootState) => {
    const cats = new Set(state.menu.items.filter((i: any) => !i.isCombo).map((i: any) => i.category));
    return ['all', ...Array.from(cats), 'combos'] as string[];
  });

  const categoryLabels: Record<string, string> = {
    all: 'All',
    combos: 'Combos',
    pizza: 'Pizza',
    burgers: 'Burgers',
    fries: 'Fries',
    momos: 'Momos',
    shakes: 'Shakes',
    drinks: 'Drinks',
    new: 'New Items',
  };

  const filteredItems = useMemo(() => {
    if (activeCat === 'all') return allMenuItems;
    if (activeCat === 'combos') return [];
    return allMenuItems.filter(item => item.category === activeCat);
  }, [activeCat, allMenuItems]);

  const showCombos = activeCat === 'all' || activeCat === 'combos';

  return (
    <div className="page animate-fade-in" id="menu-page">
      {/* Header */}
      <div style={{ padding: '1rem 0 0.5rem' }}>
        <h2>Our Menu</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--typo-200)' }}>
          Good Food, Good Mood ☕
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex', gap: '0.35rem', overflowX: 'auto',
        paddingBottom: '0.75rem', scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        marginBottom: '0.5rem',
      }}>
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '20px',
              border: activeCat === cat ? 'none' : '1.5px solid var(--bg-200)',
              background: activeCat === cat ? 'var(--primary-300)' : 'var(--bg-white)',
              color: activeCat === cat ? '#fff' : 'var(--typo-300)',
              fontSize: '0.75rem',
              fontWeight: activeCat === cat ? 600 : 400,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}
          >
            <span style={{ display: 'flex', width: 16, height: 16 }}><CategoryIcon id={cat} /></span> {categoryLabels[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}
          </button>
        ))}
      </div>

      {/* Loading */}
      {menuLoading && (
        <div className="text-center" style={{ padding: '2rem 0', color: 'var(--typo-200)' }}>
          <p style={{ fontSize: '0.85rem' }}>Loading menu...</p>
        </div>
      )}

      {/* Menu Items */}
      {!menuLoading && filteredItems.length > 0 && (
        <div className="stack" style={{ marginBottom: '1.25rem' }}>
          {filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} layout="list" />
          ))}
        </div>
      )}

      {/* Combos */}
      {!menuLoading && showCombos && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="section-header" style={{ marginTop: '0.5rem' }}>
            <span className="section-title">🎁 Special Combos</span>
          </div>
          <div className="stack">
            {comboItems.map(combo => {
              const cartCombo = cartItems.find(ci => ci.id === combo.id);
              const qty = cartCombo?.quantity ?? 0;
              return (
                <div key={combo.id} className="menu-card" id={`combo-${combo.id}`}>
                  <img src={combo.image} alt={combo.name} className="menu-card-img" loading="lazy" />
                  <div className="menu-card-info">
                    <div>
                      <span className="badge badge-primary" style={{ marginBottom: '0.2rem', display: 'inline-block' }}>
                        Combo
                      </span>
                      <div className="menu-card-name">{combo.name}</div>
                      <div className="menu-card-desc">{combo.comboContents}</div>
                    </div>
                    <div className="menu-card-bottom">
                      <span className="menu-card-price">₹{combo.price}</span>
                      {qty === 0 ? (
                        <button
                          className="add-btn"
                          onClick={() => dispatch(addItem({
                            id: combo.id, name: combo.name, price: combo.price,
                            quantity: 1, cafeId: cafeId || '', image: combo.image,
                          }))}
                          aria-label="Add to cart"
                        >
                          <Plus size={16} />
                        </button>
                      ) : (
                        <div className="qty-controls">
                          <button className="qty-btn" onClick={() =>
                            dispatch(addItem({ id: combo.id, name: combo.name, price: combo.price, quantity: -1, cafeId: cafeId || '', image: combo.image }))
                          }><Minus size={14} /></button>
                          <span className="qty-value">{qty}</span>
                          <button className="qty-btn" onClick={() =>
                            dispatch(addItem({ id: combo.id, name: combo.name, price: combo.price, quantity: 1, cafeId: cafeId || '', image: combo.image }))
                          }><Plus size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ViewCartBar />
    </div>
  );
}

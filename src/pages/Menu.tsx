import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard';
import ViewCartBar from '../components/ViewCartBar';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { selectAllMenuItems, selectComboItems } from '../store/menuSlice';
import { CategoryIcon } from '../components/CategoryIcons';
import MenuSkeleton from '../components/MenuSkeleton';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [activeCat, setActiveCat] = useState(initialCat);
  const allMenuItems = useSelector(selectAllMenuItems);
  const comboItems = useSelector(selectComboItems);
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
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Good Food, Good Mood ☕
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex', gap: '0.5rem', overflowX: 'auto',
        paddingBottom: '0.75rem', scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        marginBottom: '0.5rem',
      }}>
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: activeCat === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
              background: activeCat === cat ? 'var(--primary)' : 'var(--bg-card)',
              color: activeCat === cat ? '#fff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: activeCat === cat ? 700 : 500,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
          >
            <span style={{ display: 'flex', width: 16, height: 16 }}><CategoryIcon id={cat} /></span> 
            {categoryLabels[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {menuLoading ? (
        <MenuSkeleton />
      ) : (
        <>
          {/* Menu Items */}
          {filteredItems.length > 0 && (
            <div className="stack" style={{ marginBottom: '1.25rem' }}>
              {filteredItems.map(item => (
                <MenuItemCard key={item.id} item={item} layout="list" />
              ))}
            </div>
          )}

          {showCombos && comboItems.length > 0 && (
            <>
              <div className="section-header" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <span className="section-title">🎁 Special Combos</span>
              </div>
              <div className="stack" style={{ marginBottom: '1.25rem' }}>
                {comboItems.map(combo => (
                  <MenuItemCard key={combo.id} item={combo} layout="list" />
                ))}
              </div>
            </>
          )}

          {filteredItems.length === 0 && !showCombos && (
            <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
              <p>No items found in this category.</p>
            </div>
          )}
        </>
      )}

      <ViewCartBar />
    </div>
  );
}

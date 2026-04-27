import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import MenuItemCard from '../components/MenuItemCard';
import ViewCartBar from '../components/ViewCartBar';
import { CategoryIcon } from '../components/CategoryIcons';
import { useSelector } from 'react-redux';
import { selectAllMenuItems, selectComboItems } from '../store/menuSlice';
import type { RootState } from '../store/store';


export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [activeCat, setActiveCat] = useState('all');
  const menuItems = useSelector(selectAllMenuItems);
  const comboItems = useSelector(selectComboItems);

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
    let items = menuItems;
    if (activeCat !== 'all' && activeCat !== 'combos') {
      items = items.filter(item => item.category === activeCat);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [query, activeCat, menuItems]);

  const filteredCombos = useMemo(() => {
    if (activeCat !== 'all' && activeCat !== 'combos') return [];
    if (!query.trim()) return activeCat === 'combos' ? comboItems : [];
    const q = query.toLowerCase();
    return comboItems.filter(
      c => c.name.toLowerCase().includes(q) || (c.comboContents || '').toLowerCase().includes(q)
    );
  }, [query, activeCat, comboItems]);

  return (
    <div className="page animate-fade-in" id="search-page">
      <div style={{ padding: '1rem 0 0.5rem' }}>
        <h2 style={{ marginBottom: '0.75rem' }}>Search</h2>
        <SearchBar
          value={query}
          onChange={setQuery}
          showFilter={false}
          autoFocus
        />
      </div>

      {/* Category Chips */}
      <div className="categories-scroll" style={{ marginBottom: '1rem' }}>
        {categories.map((cat: string) => (
          <CategoryChip
            key={cat}
            icon={<CategoryIcon id={cat} />}
            name={categoryLabels[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}
            active={activeCat === cat}
            onClick={() => setActiveCat(cat)}
          />
        ))}
      </div>

      {/* Results */}
      {filteredItems.length === 0 && filteredCombos.length === 0 ? (
        <div className="text-center" style={{ padding: '3rem 0', color: 'var(--typo-200)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No items found</p>
          <p style={{ fontSize: '0.75rem' }}>Try a different search term</p>
        </div>
      ) : (
        <div className="stack" style={{ paddingBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--typo-200)', marginBottom: '0.25rem' }}>
            {filteredItems.length + filteredCombos.length} items found
          </div>
          {filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} layout="list" />
          ))}
          {filteredCombos.map(combo => (
            <div key={combo.id} className="menu-card" id={`combo-${combo.id}`}>
              <img src={combo.image} alt={combo.name} className="menu-card-img" loading="lazy" />
              <div className="menu-card-info">
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.25rem' }}>🎁 Combo</span>
                  <div className="menu-card-name">{combo.name}</div>
                  <div className="menu-card-desc">{combo.comboContents}</div>
                </div>
                <div className="menu-card-bottom">
                  <span className="menu-card-price">₹{combo.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ViewCartBar />
    </div>
  );
}

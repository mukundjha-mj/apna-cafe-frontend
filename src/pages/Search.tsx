import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import MenuItemCard from '../components/MenuItemCard';
import ViewCartBar from '../components/ViewCartBar';
import { CategoryIcon } from '../components/CategoryIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu, selectAllMenuItems, selectComboItems } from '../store/menuSlice';
import type { AppDispatch, RootState } from '../store/store';
import MenuSkeleton from '../components/MenuSkeleton';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [activeCat, setActiveCat] = useState('all');
  
  const dispatch = useDispatch<AppDispatch>();
  const menuItems = useSelector(selectAllMenuItems);
  const comboItems = useSelector(selectComboItems);
  const menuLoading = useSelector((state: RootState) => state.menu.loading);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

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

      {/* Loading Skeleton */}
      {menuLoading ? (
        <MenuSkeleton />
      ) : (filteredItems.length === 0 && filteredCombos.length === 0) ? (
        <div className="text-center" style={{ padding: '3rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No items found</p>
          <p style={{ fontSize: '0.75rem' }}>Try a different search term</p>
        </div>
      ) : (
        <div className="stack" style={{ paddingBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            {filteredItems.length + filteredCombos.length} items found
          </div>
          {filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} layout="list" />
          ))}
          {filteredCombos.map(combo => (
            <MenuItemCard key={combo.id} item={combo} layout="list" />
          ))}
        </div>
      )}

      <ViewCartBar />
    </div>
  );
}

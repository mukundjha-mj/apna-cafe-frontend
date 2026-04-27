import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Heart, Bell } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import CategoryChip from '../components/CategoryChip';
import MenuItemCard from '../components/MenuItemCard';
import ViewCartBar from '../components/ViewCartBar';
import CafeLogo from '../components/CafeLogo';
import { CategoryIcon } from '../components/CategoryIcons';
import { selectBestsellers, selectNewItems, selectComboItems } from '../store/menuSlice';
import { useState } from 'react';


export default function Home() {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const bestsellers = useSelector(selectBestsellers);
  const newItems = useSelector(selectNewItems);
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

  const handleSearch = (val: string) => {
    setSearchVal(val);
    if (val.length > 0) {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    }
  };

  return (
    <div className="page animate-fade-in" id="home-page">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 0 0.5rem',
      }}>
        <CafeLogo />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="page-header-icon"
            onClick={() => navigate('/favorites')}
            aria-label="Favorites"
          >
            <Heart size={20} />
          </button>
          <button className="page-header-icon" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ margin: '0.5rem 0 1rem' }}>
        <SearchBar
          value={searchVal}
          onChange={handleSearch}
          placeholder="Would you like to eat something?"
        />
      </div>

      {/* Promo Banner */}
      <PromoBanner />

      {/* Loading State */}
      {menuLoading && (
        <div className="text-center" style={{ padding: '2rem 0', color: 'var(--typo-200)' }}>
          <p style={{ fontSize: '0.85rem' }}>Loading menu...</p>
        </div>
      )}

      {/* Categories */}
      {!menuLoading && (
        <>
          <div style={{ margin: '1.25rem 0 0.75rem' }}>
            <div className="section-header">
              <span className="section-title">Categories</span>
              <span className="section-link" onClick={() => navigate('/menu')}>See all</span>
            </div>
            <div className="categories-scroll">
              {categories.map((cat: string) => (
                <CategoryChip
                  key={cat}
                  icon={<CategoryIcon id={cat} />}
                  name={categoryLabels[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}
                  active={false}
                  onClick={() => navigate(`/menu?cat=${cat}`)}
                />
              ))}
            </div>
          </div>

          {/* Bestsellers */}
          {bestsellers.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="section-header">
                <span className="section-title">🔥 Bestsellers</span>
                <span className="section-link" onClick={() => navigate('/menu')}>See all</span>
              </div>
              <div className="grid-2">
                {bestsellers.slice(0, 4).map(item => (
                  <MenuItemCard key={item.id} item={item} layout="grid" />
                ))}
              </div>
            </div>
          )}

          {/* New Items */}
          {newItems.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="section-header">
                <span className="section-title">✨ New Arrivals</span>
              </div>
              <div className="grid-2">
                {newItems.map(item => (
                  <MenuItemCard key={item.id} item={item} layout="grid" />
                ))}
              </div>
            </div>
          )}

          {/* Combo Deals */}
          {comboItems.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="section-header">
                <span className="section-title">🎁 Combo Deals</span>
                <span className="section-link" onClick={() => navigate('/menu?cat=combos')}>See all</span>
              </div>
              <div style={{
                display: 'flex', gap: '0.75rem', overflowX: 'auto',
                scrollbarWidth: 'none', msOverflowStyle: 'none',
                paddingBottom: '0.5rem',
              }}>
                {comboItems.slice(0, 5).map(combo => (
                  <div
                    key={combo.id}
                    className="card"
                    style={{ minWidth: '200px', flex: '0 0 200px', cursor: 'pointer' }}
                    onClick={() => navigate('/menu?cat=combos')}
                  >
                    <img
                      src={combo.image}
                      alt={combo.name}
                      style={{ width: '100%', height: '110px', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div style={{ padding: '0.65rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.15rem' }}>
                        {combo.name}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--typo-200)', marginBottom: '0.35rem' }}>
                        {combo.comboContents}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-300)' }}>
                        ₹{combo.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Items */}
          {bestsellers.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="section-header">
                <span className="section-title">Popular Items</span>
                <span className="section-link" onClick={() => navigate('/menu')}>See all</span>
              </div>
              <div className="stack">
                {bestsellers.map(item => (
                  <MenuItemCard key={item.id} item={item} layout="list" />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ViewCartBar />
    </div>
  );
}

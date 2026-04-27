import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { selectAllMenuItems } from '../store/menuSlice';
import MenuItemCard from '../components/MenuItemCard';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const favoriteIds = useSelector((state: RootState) => state.favorites.itemIds);
  const menuItems = useSelector(selectAllMenuItems);
  const favoriteItems = menuItems.filter(item => favoriteIds.includes(item.id));

  return (
    <div className="page animate-fade-in" id="favorites-page">
      <div style={{ padding: '1rem 0 0.5rem' }}>
        <h2>❤️ Favorites</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--typo-200)' }}>Your saved items</p>
      </div>
      {favoriteItems.length === 0 ? (
        <div className="text-center" style={{ padding: '4rem 0', color: 'var(--typo-200)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Heart size={36} color="var(--primary-300)" />
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--typo-400)', marginBottom: '0.25rem' }}>No favorites yet</p>
          <p style={{ fontSize: '0.8rem' }}>Tap the heart icon on any item to save it here</p>
        </div>
      ) : (
        <div className="grid-2" style={{ paddingBottom: '1rem' }}>
          {favoriteItems.map(item => (
            <MenuItemCard key={item.id} item={item} layout="grid" />
          ))}
        </div>
      )}
    </div>
  );
}

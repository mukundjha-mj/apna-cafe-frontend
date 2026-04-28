import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, MapPin } from 'lucide-react';
import type { RootState, AppDispatch } from '../store/store';
import { selectBestsellers, selectComboItems, toggleOrderType } from '../store/menuSlice';
import ServiceSelectionModal from '../components/ServiceSelectionModal';
import PromoBanner from '../components/PromoBanner';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import MenuItemCard from '../components/MenuItemCard';
import ViewCartBar from '../components/ViewCartBar';
import { CategoryIcon } from '../components/CategoryIcons';
import CafeLogo from '../components/CafeLogo';
import HomeSkeleton from '../components/HomeSkeleton';
import AddAddressModal from '../components/AddAddressModal';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchVal, setSearchVal] = useState('');
  const bestsellers = useSelector(selectBestsellers);
  const comboItems = useSelector(selectComboItems);
  const { orderType } = useSelector((state: RootState) => state.menu);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [activeAddress, setActiveAddress] = useState<any>(null);

  // Initialize service modal if no order type is set
  useEffect(() => {
    if (!orderType) {
      const timer = setTimeout(() => setIsServiceModalOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [orderType]);

  // Handle Delivery Address Auto-Select or Prompt
  useEffect(() => {
    const checkAddress = async () => {
      if (orderType === 'DELIVERY') {
        if (!user?.id) {
          // If no user, just prompt or use local fallback if you want
          // But for now, we expect a logged-in user to have an address
          setIsAddressModalOpen(true);
          return;
        }

        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const res = await fetch(`${API_URL}/api/addresses/${user.id}`);
          const data = await res.json();
          if (data.success && data.data.length > 0) {
            const defaultAddr = data.data.find((a: any) => a.isDefault) || data.data[0];
            setActiveAddress(defaultAddr);
          } else {
            setIsAddressModalOpen(true);
          }
        } catch (err) {
          console.error('Failed to fetch addresses', err);
        }
      }
    };
    checkAddress();
  }, [orderType, user]);

  const handleSaveAddress = async (newAddr: any) => {
    if (!user?.id) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/addresses/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr)
      });
      const data = await res.json();
      if (data.success) {
        setActiveAddress(data.data);
      }
    } catch (err) {
      console.error('Failed to save address', err);
    }
  };

  const menuLoading = useSelector((state: RootState) => state.menu.loading);

  const categories = useSelector((state: RootState) => {
    const cats = new Set(state.menu.items.filter((i: any) => !i.isCombo).map((i: any) => i.category));
    return ['all', ...Array.from(cats), 'combos'] as string[];
  });

  const categoryLabels: Record<string, string> = {
    all: 'All', combos: 'Combos', pizza: 'Pizza', burgers: 'Burgers', fries: 'Fries', momos: 'Momos', shakes: 'Shakes', drinks: 'Drinks', new: 'New Items',
  };

  const handleSearch = (val: string) => {
    setSearchVal(val);
    if (val.length > 0) {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    }
  };

  return (
    <div className="page animate-fade-in" id="home-page">
      <ServiceSelectionModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
      />
      <AddAddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
      />

      {/* BK Header Style */}
      <header className="bk-header">
        <div className="bk-header-top">
          <div className="bk-header-left">
            <CafeLogo />
          </div>
          <div className="bk-header-right">
            <Heart size={24} onClick={() => navigate('/favorites')} />
          </div>
        </div>

        <div className="bk-header-mid">
          <div className="bk-service-toggle" onClick={() => dispatch(toggleOrderType())}>
            <span className={orderType === 'DELIVERY' ? 'active' : ''}>DELIVERY</span>
            <div className={`bk-toggle-switch ${orderType !== 'DELIVERY' ? 'right' : ''}`}>
              <div className="bk-toggle-knob" />
            </div>
            <span className={orderType !== 'DELIVERY' ? 'active' : ''}>DINE-IN/TAKEAWAY</span>
          </div>
        </div>

        {orderType === 'DELIVERY' && (
          <div className="bk-location-bar" onClick={() => activeAddress ? navigate('/saved-addresses') : setIsAddressModalOpen(true)}>
            <div className="bk-loc-left">
              <MapPin size={20} />
              <span className="bk-loc-label">DELIVER TO:</span>
            </div>
            <div className="bk-loc-input">
              <span>{activeAddress ? `${activeAddress.type} - ${activeAddress.address}` : 'Set Delivery Address...'}</span>
            </div>
          </div>
        )}
      </header>

      {/* Promo Banner */}
      <div style={{ marginTop: '1rem' }}>
        <PromoBanner />
      </div>

      {/* Search - Moving search below header as per common app designs */}
      <div className="search-container" style={{ marginTop: '1rem' }}>
        <SearchBar
          value={searchVal}
          onChange={handleSearch}
          placeholder="What would you like to enjoy today?"
        />
      </div>

      {menuLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          {/* Categories */}
          <div className="home-section">
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

          {/* Recommended */}
          {bestsellers.length > 0 && (
            <div className="home-section">
              <div className="section-header">
                <span className="section-title">🌟 Recommended</span>
              </div>
              <div className="grid-2">
                {bestsellers.slice(0, 4).map(item => (
                  <MenuItemCard key={item.id} item={item} layout="grid" />
                ))}
              </div>
            </div>
          )}

          {/* Combo Deals */}
          {comboItems.length > 0 && (
            <div className="home-section">
              <div className="section-header">
                <span className="section-title">🎁 Combo Deals</span>
                <span className="section-link" onClick={() => navigate('/menu?cat=combos')}>See all</span>
              </div>
              <div className="combos-scroll">
                {comboItems.slice(0, 5).map(combo => (
                  <div key={combo.id} className="combo-card-alt" onClick={() => navigate('/menu?cat=combos')}>
                    <img src={combo.imageUrl || '/assets/img-placeholder.svg'} alt={combo.name} loading="lazy" />
                    <div className="combo-info">
                      <div className="combo-name">{combo.name}</div>
                      <div className="combo-contents">{combo.comboContents}</div>
                      <div className="combo-price">₹{combo.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ViewCartBar />

      <style>{`
        .bk-header {
          background: #120A06; /* Even darker espresso */
          padding: 1rem 1rem 1.25rem;
          margin: 0 -1.25rem 0; /* Removed negative top margin */
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }
        .bk-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .bk-header-left {
          display: flex;
          align-items: center;
        }
        .bk-header-right {
          color: #BA7517;
          display: flex;
          align-items: center;
        }
        .bk-header-mid {
          display: flex;
          justify-content: center;
          padding: 0.5rem 0;
        }
        .bk-service-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 900;
          font-size: 0.9rem;
          cursor: pointer;
          user-select: none;
        }
        .bk-service-toggle span {
          color: rgba(186, 117, 23, 0.2);
          transition: all 0.3s;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }
        .bk-service-toggle span.active {
          color: #BA7517;
          font-weight: 900;
        }
        .bk-toggle-switch {
          width: 48px;
          height: 24px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          position: relative;
          transition: background 0.3s;
          border: 1px solid rgba(186, 117, 23, 0.1);
          flex-shrink: 0;
        }
        .bk-toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          background: #BA7517;
          border-radius: 50%;
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .bk-toggle-switch.right .bk-toggle-knob {
          transform: translateX(24px);
        }
        .bk-location-bar {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.02);
        }
        .bk-loc-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #BA7517;
          white-space: nowrap;
        }
        .bk-loc-label {
          font-weight: 900;
          font-size: 0.65rem;
          letter-spacing: 0.5px;
        }
        .bk-loc-input {
          flex: 1;
          color: rgba(245, 235, 224, 0.5); /* Faded cream */
          font-size: 0.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        /* Reset search container margins if needed */
        .search-container {
          margin-bottom: 1.5rem;
        }
        .home-section {
          margin-bottom: 2rem;
        }

        .combos-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 0.5rem 0 1.5rem;
        }
        .combos-scroll::-webkit-scrollbar {
          display: none;
        }
        .combo-card-alt {
          min-width: 220px;
          flex: 0 0 220px;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s;
        }
        .combo-card-alt:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
        }
        .combo-card-alt img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }
        .combo-info {
          padding: 1rem;
        }
        .combo-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-cream);
          margin-bottom: 0.25rem;
        }
        .combo-contents {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          line-height: 1.3;
          height: 2.6em;
          overflow: hidden;
        }
        .combo-price {
          font-size: 1rem;
          font-weight: 800;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}

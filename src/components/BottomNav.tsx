import { NavLink } from 'react-router-dom';
import { Home, Search, ClipboardList, User } from 'lucide-react';
import { prefetchPage } from '../utils/prefetch';

const navItems = [
  { to: '/', label: 'Home', icon: Home, page: 'Home' },
  { to: '/search', label: 'Search', icon: Search, page: 'Search' },
  { to: '/orders', label: 'Orders', icon: ClipboardList, page: 'Orders' },
  { to: '/profile', label: 'Profile', icon: User, page: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" id="bottom-nav">
      {navItems.map(({ to, label, icon: Icon, page }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `bottom-nav-item${isActive ? ' active' : ''}`
          }
          onMouseEnter={() => prefetchPage(page)}
          onTouchStart={() => prefetchPage(page)}
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

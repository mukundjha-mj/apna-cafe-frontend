import { NavLink } from 'react-router-dom';
import { Home, Search, ClipboardList, User } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" id="bottom-nav">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `bottom-nav-item${isActive ? ' active' : ''}`
          }
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

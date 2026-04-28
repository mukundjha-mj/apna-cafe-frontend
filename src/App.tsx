import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import { initAuth, setAuthModalOpen } from './store/authSlice';
import { fetchMenu } from './store/menuSlice';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import Menu from './pages/Menu';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderStatus from './pages/OrderStatus';
import Profile from './pages/Profile';
import MyProfile from './pages/MyProfile';
import Wallet from './pages/Wallet';
import CafeDashboard from './pages/CafeDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SavedAddresses from './pages/SavedAddresses';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      dispatch(setAuthModalOpen(true));
    }
  }, [initialized, isAuthenticated, dispatch]);

  if (!initialized) return null;
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location }} />;
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { initialized, isAuthModalOpen, user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (initialized && isAuthenticated && user?.role === 'ADMIN' && !location.pathname.startsWith('/cafe')) {
      // Admins should stay in the dashboard area
      // navigate('/cafe/dashboard'); // Don't navigate here, just let the routes handle it
    }
  }, [initialized, isAuthenticated, user, location]);

  useEffect(() => {
    dispatch(initAuth());
    dispatch(fetchMenu());
  }, [dispatch]);

  const hideNav = ['/cart', '/checkout', '/cafe/dashboard', '/my-profile'].some(p => location.pathname.startsWith(p))
    || location.pathname.startsWith('/order/');

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!initialized) return null;

  return (
    <div className="app-container">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(setAuthModalOpen(false))}
        onSuccess={() => dispatch(setAuthModalOpen(false))}
      />
      <ScrollToTop />

      <main>
        <Routes>
          {/* Guest Friendly Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Routes */}
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/order/:orderId" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/saved-addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />

          {/* Checkout (has internal auth gate) */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Cafe Dashboard (Admin Only) */}
          <Route path="/cafe/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'ADMIN' ? <CafeDashboard /> : <Navigate to="/" replace />}
            </ProtectedRoute>
          } />

          {/* Legal */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

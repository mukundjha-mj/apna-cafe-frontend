import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import { initAuth, setAuthModalOpen } from './store/authSlice';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';

// Helper to handle chunk load errors by reloading the page
const lazyWithRetry = (componentImport: () => Promise<any>) => 
  lazy(async () => {
    const pageHasAlreadyBeenReloaded = JSON.parse(
      window.sessionStorage.getItem('page-has-been-reloaded') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-reloaded', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenReloaded) {
        window.sessionStorage.setItem('page-has-been-reloaded', 'true');
        window.location.reload();
        return { default: () => null };
      }
      throw error;
    }
  });

// Lazy load pages for better initial performance
const Home = lazyWithRetry(() => import('./pages/Home'));
const SearchPage = lazyWithRetry(() => import('./pages/Search'));
const Menu = lazyWithRetry(() => import('./pages/Menu'));
const Favorites = lazyWithRetry(() => import('./pages/Favorites'));
const Cart = lazyWithRetry(() => import('./pages/Cart'));
const Checkout = lazyWithRetry(() => import('./pages/Checkout'));
const Orders = lazyWithRetry(() => import('./pages/Orders'));
const OrderStatus = lazyWithRetry(() => import('./pages/OrderStatus'));
const Profile = lazyWithRetry(() => import('./pages/Profile'));
const MyProfile = lazyWithRetry(() => import('./pages/MyProfile'));
const Wallet = lazyWithRetry(() => import('./pages/Wallet'));
const CafeDashboard = lazyWithRetry(() => import('./pages/CafeDashboard'));
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazyWithRetry(() => import('./pages/TermsOfService'));
const SavedAddresses = lazyWithRetry(() => import('./pages/SavedAddresses'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const HelpCenter = lazyWithRetry(() => import('./pages/HelpCenter'));
const AuthModal = lazyWithRetry(() => import('./components/AuthModal'));

// Loading component for Suspense
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
    <div className="animate-pulse" style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 600 }}>Loading...</div>
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>

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

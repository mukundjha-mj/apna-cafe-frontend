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
import CafeDashboard from './pages/CafeDashboard';
import AuthModal from './components/AuthModal';

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
  const { initialized, isAuthModalOpen } = useSelector((state: RootState) => state.auth);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    dispatch(initAuth());
    dispatch(fetchMenu());
  }, [dispatch]);

  const hideNav = ['/cart', '/checkout', '/cafe/dashboard'].some(p => location.pathname.startsWith(p))
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
          
          {/* Checkout (has internal auth gate) */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Cafe Dashboard */}
          <Route path="/cafe/dashboard" element={<CafeDashboard />} />

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

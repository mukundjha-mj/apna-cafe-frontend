import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import { initAuth } from './store/authSlice';
import { fetchMenu } from './store/menuSlice';
import BottomNav from './components/BottomNav';
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
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);
  if (!initialized) return null; // Wait for session check
  if (!isAuthenticated) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);
  if (!initialized) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);

  // Initialize auth session on mount
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  // Fetch menu when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMenu());
    }
  }, [isAuthenticated, dispatch]);

  const authRoutes = ['/welcome', '/login', '/signup'];
  const isAuthPage = authRoutes.includes(location.pathname);

  const hideNav = isAuthPage
    || ['/cart', '/checkout', '/cafe/dashboard'].some(p => location.pathname.startsWith(p))
    || location.pathname.startsWith('/order/');

  // Show nothing until auth is checked
  if (!initialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className={isAuthPage ? 'app-container app-container-auth' : 'app-container'}>
      <main>
        <Routes>
          {/* Auth Routes */}
          <Route path="/welcome" element={<AuthRoute><Welcome /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/order/:orderId" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Cafe Dashboard (no auth needed) */}
          <Route path="/cafe/dashboard" element={<CafeDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/welcome'} replace />} />
        </Routes>
      </main>
      {!hideNav && isAuthenticated && <BottomNav />}
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

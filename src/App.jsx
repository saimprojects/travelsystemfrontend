import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/HomePage';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Clients from './pages/Clients';
import Bookings from './pages/Bookings';
import Onboard from './pages/Onboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const LegacyDashboardRedirect = ({ to }) => {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes — wrapped in PublicLayout (Navbar + Footer + RegisterPopup) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Legacy redirects */}
          <Route path="/settings" element={<LegacyDashboardRedirect to="/dashboard/settings" />} />
          <Route path="/services" element={<LegacyDashboardRedirect to="/dashboard/services" />} />
          <Route path="/clients" element={<LegacyDashboardRedirect to="/dashboard/clients" />} />
          <Route path="/bookings" element={<LegacyDashboardRedirect to="/dashboard/bookings" />} />
          <Route path="/bookings/:id" element={<LegacyDashboardRedirect to="/dashboard/bookings" />} />
          <Route path="/onboard" element={<LegacyDashboardRedirect to="/dashboard/onboard" />} />
          <Route path="/analytics" element={<LegacyDashboardRedirect to="/dashboard/analytics" />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={['agency_owner', 'manager']}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="services"
              element={
                <ProtectedRoute allowedRoles={['agency_owner', 'manager', 'agent']}>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="clients"
              element={
                <ProtectedRoute allowedRoles={['agency_owner', 'manager', 'agent']}>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookings"
              element={
                <ProtectedRoute allowedRoles={['agency_owner', 'manager', 'agent']}>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookings/:id"
              element={<Navigate to="/dashboard/bookings" replace />}
            />
            <Route
              path="onboard"
              element={
                <ProtectedRoute allowedRoles={['agency_owner', 'manager', 'agent']}>
                  <Onboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedRoute allowedRoles={['agency_owner', 'manager', 'accountant']}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

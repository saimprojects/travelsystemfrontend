import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage'; // Import HomePage
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Clients from './pages/Clients';
import Bookings from './pages/Bookings';
import Onboard from './pages/Onboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          
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
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
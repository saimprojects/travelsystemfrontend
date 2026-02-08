import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
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
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
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
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

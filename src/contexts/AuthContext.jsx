import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, agencyAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');

      if (storedUser && token) {
        try {
          // Verify token is still valid
          const profileResponse = await authAPI.getProfile();
          setUser(profileResponse.data);
          
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(profileResponse.data));
        } catch (error) {
          console.log('Session verification failed:', error.message);
          
          // Keep stored user for UI but mark as needing refresh
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser({ ...parsedUser, _needsRefresh: true });
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ✅ FIXED: Simplified login function
  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt with:', email);
      
      let response;
      
      // Try with email first
      try {
        response = await authAPI.login({ email, password });
      } catch (emailError) {
        console.log('Email login failed, trying username');
        response = await authAPI.login({ username: email, password });
      }

      console.log('✅ Login successful, storing tokens');
      
      const { access, refresh } = response.data;

      // Store tokens
      localStorage.setItem('access_token', access);
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }
      localStorage.setItem('last_email', email);

      // Get user profile
      console.log('👤 Fetching user profile...');
      let userData;
      try {
        const profileResponse = await authAPI.getProfile();
        userData = profileResponse.data;
        console.log('✅ Profile loaded:', userData);
      } catch (profileError) {
        console.log('⚠️ Profile fetch failed, creating basic profile');
        
        // Create basic user data from email
        userData = {
          id: Date.now(),
          email: email,
          username: email.split('@')[0],
          role: 'user',
          agency_id: null
        };
        
        // If backend returned user data, merge it
        if (response.data.user) {
          userData = { ...userData, ...response.data.user };
        }
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Check agency status in background
      setTimeout(async () => {
        try {
          const statusResponse = await agencyAPI.checkAgencyStatus();
          if (statusResponse.data.agency_status) {
            localStorage.setItem('agency_status', statusResponse.data.agency_status);
            
            // If agency is not active, show warning
            if (statusResponse.data.agency_status !== 'active') {
              console.log('⚠️ Agency status issue:', statusResponse.data);
            }
          }
        } catch (statusError) {
          console.log('Agency status check skipped');
        }
      }, 1000);

      toast.success('Login successful!');
      return true;
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Format error message for display
      let errorMessage = 'Login failed. ';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (error.response?.status === 403) {
        // Agency status errors
        const errorDetail = error.response?.data?.detail || '';
        errorMessage = errorDetail || 'Agency account is not active.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage += error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    
    // Clear all stored data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('agency_status');
    localStorage.removeItem('last_email');
    
    setUser(null);
    toast.success('Logged out successfully');
    
    // Redirect to login
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const refreshUser = async () => {
    try {
      const profileResponse = await authAPI.getProfile();
      const userData = profileResponse.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.log('User refresh failed:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user && !!localStorage.getItem('access_token'),
    isOwner: user?.role === 'agency_owner',
    isManager: user?.role === 'manager',
    isAgent: user?.role === 'agent',
    isAccountant: user?.role === 'accountant',
    canManageSettings: user?.role === 'agency_owner' || user?.role === 'manager',
    canViewAnalytics: ['agency_owner', 'manager', 'accountant'].includes(user?.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
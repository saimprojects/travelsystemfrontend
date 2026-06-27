import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// ✅ FIXED: Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    // Only add token if it exists and is valid
    if (token && token !== 'null' && token !== 'undefined' && token.length > 30) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging (only in development)
    if (import.meta.env.DEV) {
      console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ FIXED: Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    // Log response for debugging (only in development)
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};
    
    // Log error
    console.error('❌ API Error:', {
      url: originalRequest.url,
      method: originalRequest.method,
      status: error.response?.status,
      data: error.response?.data
    });

    // ✅ Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Don't try to refresh token for login endpoint
      if (originalRequest.url?.includes('/auth/login/')) {
        return Promise.reject(error);
      }

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          console.log('🔄 Attempting token refresh...');
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });

          if (refreshResponse.data.access) {
            localStorage.setItem('access_token', refreshResponse.data.access);
            
            // Update the original request
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
            console.log('✅ Token refreshed successfully');
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError.message);
      }
      
      // Clear auth data and redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        console.log('🔒 Redirecting to login...');
        window.location.href = '/login';
      }
      
      error.displayMessage = 'Session expired. Please login again.';
      return Promise.reject(error);
    }

    // ✅ Handle 403 - Forbidden (don't auto-logout)
    if (error.response?.status === 403) {
      const errorData = error.response?.data || {};
      
      // If it's an agency status error, pass it through
      if (errorData.detail?.includes('agency') || 
          errorData.detail?.includes('Agency') ||
          originalRequest.url?.includes('/agency/')) {
        console.log('🏢 Agency access issue - passing to component');
        return Promise.reject(error);
      }
      
      // For other 403 errors, show message but don't logout
      console.log('🚫 Access denied for:', originalRequest.url);
      error.displayMessage = 'You do not have permission to access this resource.';
      return Promise.reject(error);
    }

    // ✅ Handle 500 - Server errors
    if (error.response?.status === 500) {
      console.error('🔥 Server error:', error.response.data);
      error.displayMessage = 'Server error. Please try again later.';
      return Promise.reject(error);
    }

    // ✅ Handle network errors
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
      error.displayMessage = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    // ✅ Default error handling
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'An error occurred';
    
    error.displayMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api;

// ✅ AUTH API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  
  getProfile: () => api.get('/auth/profile/').catch(error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return Promise.reject(error);
    }

    console.log('Profile API failed, using stored user data');
    
    // Return stored user data as fallback
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return { data: JSON.parse(storedUser) };
    }
    
    return Promise.reject(error);
  }),
  
  updateProfile: (data) => api.patch('/auth/profile/', data),
};

// ✅ AGENCY API (FIXED)
export const agencyAPI = {
  // Public agency info (for all authenticated users - invoices, display, etc.)
  getAgencyPublic: () => api.get('/agency/public/'),
  
  // Admin agency details (for owners/managers only)
  getAgency: () => api.get('/agency/').catch(error => {
    console.log('Admin agency API failed, trying public endpoint');
    return api.get('/agency/public/');
  }),
  
  updateAgency: (data) => {
    if (data instanceof FormData) {
      return api.patch('/agency/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.patch('/agency/', data);
  },
  
  // Check agency status
  checkAgencyStatus: () => api.get('/agency/check-status/')
};

// ✅ USERS API
export const usersAPI = {
  getUsers: (params) => api.get('/users/', { params }),
  createUser: (data) => api.post('/users/', data),
  updateUser: (id, data) => api.patch(`/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/users/${id}/`),
  deactivateUser: (id) => api.post(`/users/${id}/deactivate/`),
  activateUser: (id) => api.post(`/users/${id}/activate/`),
};

// ✅ SERVICES API
export const servicesAPI = {
  getServices: (params) => api.get('/services/', { params }),
  getService: (id) => api.get(`/services/${id}/`),
  createService: (data) => api.post('/services/', data),
  updateService: (id, data) => api.patch(`/services/${id}/`, data),
  deleteService: (id) => api.delete(`/services/${id}/`),
  activateService: (id) => api.post(`/services/${id}/activate/`),
  deactivateService: (id) => api.post(`/services/${id}/deactivate/`),
};

// ✅ CLIENTS API
export const clientsAPI = {
  getClients: (params) => api.get('/clients/', { params }),
  getClient: (id) => api.get(`/clients/${id}/`),
  createClient: (data) => api.post('/clients/', data),
  updateClient: (id, data) => api.patch(`/clients/${id}/`, data),
  deleteClient: (id) => api.delete(`/clients/${id}/`),
  addNote: (id, data) => api.post(`/clients/${id}/add_note/`, data),
};

// ✅ BOOKINGS API
export const bookingsAPI = {
  getBookings: (params) => api.get('/bookings/', { params }),
  getBooking: (id) => api.get(`/bookings/${id}/`),
  createBooking: (data) => api.post('/bookings/', data),
  updateBooking: (id, data) => api.patch(`/bookings/${id}/`, data),
  deleteBooking: (id) => api.delete(`/bookings/${id}/`),
  updatePayment: (id, data) => api.post(`/bookings/${id}/update_payment/`, data),
  addNote: (id, data) => api.post(`/bookings/${id}/add_note/`, data),
  
  // Badge/summary for missing dates
  getDatesSummary: () => api.get('/bookings/dates_summary/'),
};

// ✅ ONBOARD API
export const onboardAPI = {
  getOnboard: (params) => api.get('/onboard/', { params }),
};

// ✅ ANALYTICS API
export const analyticsAPI = {
  getAnalytics: (params) => api.get('/analytics/', { params }),
};

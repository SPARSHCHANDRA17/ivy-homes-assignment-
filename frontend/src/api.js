import axios from 'axios';

const BASE_URL = 'https://solve.ivy.homes';
const API_KEY = 'IVY26-A78847D9979E';

// Create a configured axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// Helper to get tokens from localStorage
const getTokens = () => {
  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token')
  };
};

// Add access token to every request
api.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken && !config.url.includes('/auth/')) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Intercept 401 errors and attempt token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { refreshToken } = getTokens();
      if (!refreshToken) {
        // No refresh token, force logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh (using the truth, not the doc's lie!)
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'X-API-Key': API_KEY } }
        );

        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        // Update the failed request with the new token and retry it
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear session and force login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// --- API Service Methods ---

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },
  logout: () => {
    localStorage.clear();
    // We don't bother calling the /auth/logout endpoint because 
    // simply dropping the tokens client-side is safer and faster.
  },
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const propertyService = {
  // Using offset instead of page!
  getListings: async (offset = 0, limit = 20, filters = {}) => {
    const params = { offset, limit, ...filters };
    const response = await api.get('/v1/listings', { params });
    // Filter out inactive listings client-side since the server lies!
    if (response.data && response.data.results) {
       response.data.results = response.data.results.filter(l => l.is_live);
    }
    return response.data;
  },
  
  getListingDetails: async (id) => {
    const response = await api.get(`/v1/listings/${id}`);
    return response.data;
  },

  getRentals: async (offset = 0, limit = 20) => {
    const response = await api.get('/v1/rentals', { params: { offset, limit } });
    return response.data;
  },

  getProjects: async (offset = 0, limit = 20) => {
    const response = await api.get('/v1/projects', { params: { offset, limit } });
    // Fix the price_min / price_max units from Crores to Rupees
    if (response.data && response.data.results) {
        response.data.results = response.data.results.map(p => ({
            ...p,
            price_min_inr: p.price_min ? p.price_min * 10000000 : null,
            price_max_inr: p.price_max ? p.price_max * 10000000 : null
        }));
    }
    return response.data;
  }
};

export const favoritesService = {
  getFavorites: async () => {
    const saved = JSON.parse(localStorage.getItem('local_favorites') || '[]');
    return { results: saved };
  },
  addFavorite: async (id) => {
    // Fetch full listing details or store basic state locally
    const saved = JSON.parse(localStorage.getItem('local_favorites') || '[]');
    // Check if already saved
    if (!saved.some(item => item.listing_id === id)) {
      // For a smooth experience, fetch the listing details and store it
      const detail = await propertyService.getListingDetails(id);
      saved.push(detail);
      localStorage.setItem('local_favorites', JSON.stringify(saved));
    }
    return { success: true };
  },
  removeFavorite: async (id) => {
    let saved = JSON.parse(localStorage.getItem('local_favorites') || '[]');
    saved = saved.filter(item => item.listing_id !== id);
    localStorage.setItem('local_favorites', JSON.stringify(saved));
    return { success: true };
  }
};

export const analyticsService = {
  getSummary: async () => {
    const response = await api.get('/v1/analytics/summary');
    return response.data;
  }
};

export default api;
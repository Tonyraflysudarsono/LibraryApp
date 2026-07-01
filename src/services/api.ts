import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lib_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on authorization failure
      localStorage.removeItem('lib_token');
      localStorage.removeItem('lib_user');
      // Optional: window.location.reload() or let the application handle it via state
    }
    return Promise.reject(error);
  }
);

export default api;

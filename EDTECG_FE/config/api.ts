import axios from 'axios';

// Load environment variables with fallback values
const API_URL = process.env.REACT_APP_API_URL || 'http://20.89.64.149';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000');

// Create axios instance with configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for handling requests
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally here
    return Promise.reject(error);
  }
);

export default api; 
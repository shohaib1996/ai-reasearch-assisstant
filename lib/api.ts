import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create Axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 120000, // 2 minutes timeout for research requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.code === 'ECONNABORTED') {
      console.error('[API Timeout] Request timed out');
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }

    if (!error.response) {
      console.error('[API Network Error] No response received');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    const status = error.response.status;
    let message = 'An error occurred';

    switch (status) {
      case 400:
        message = 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'Unauthorized. Please log in.';
        break;
      case 403:
        message = 'Access forbidden.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = `Error: ${status}`;
    }

    console.error(`[API Error] ${status}: ${message}`);
    return Promise.reject(new Error(message));
  }
);

export default api;

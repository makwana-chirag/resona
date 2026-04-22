import axios from 'axios';
import { DEEZER_API_BASE_URL, DEEZER_API_TIMEOUT } from '@env';
import { Platform } from 'react-native';

// Create axios instance with default config
export const deezerClient = axios.create({
  baseURL: DEEZER_API_BASE_URL,
  timeout: parseInt(DEEZER_API_TIMEOUT || '10000', 10),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate',
  },
  // React Native specific
  paramsSerializer: (params) => {
    // Custom params serializer for better performance
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
  },
});

// Request interceptor - Add loading indicators, auth, etc.
deezerClient.interceptors.request.use(
  (config) => {
    // You can add loading state here
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add platform info to headers (useful for analytics)
    config.headers['X-Platform'] = Platform.OS;
    config.headers['X-App-Version'] = '1.0.0';
    
    return config;
  },
  (error) => {
    console.error('📡 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
deezerClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return Promise.reject(error);
    }

    // Network errors
    if (!error.response) {
      console.error('🌍 Network Error:', error.message);
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Network connection failed. Please check your internet.',
        originalError: error,
      });
    }

    // HTTP error responses
    const { status, data, config } = error.response;
    
    console.error(`❌ API Error: ${config.url} - Status: ${status}`);
    
    switch (status) {
      case 400:
        return Promise.reject({
          code: 'BAD_REQUEST',
          message: data.error?.message || 'Invalid request parameters',
          status,
        });
      case 401:
        return Promise.reject({
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          status,
        });
      case 403:
        return Promise.reject({
          code: 'FORBIDDEN',
          message: 'Access denied',
          status,
        });
      case 404:
        return Promise.reject({
          code: 'NOT_FOUND',
          message: 'Resource not found',
          status,
        });
      case 429:
        return Promise.reject({
          code: 'RATE_LIMIT',
          message: 'Too many requests. Please wait a moment.',
          status,
        });
      case 500:
      case 502:
      case 503:
        return Promise.reject({
          code: 'SERVER_ERROR',
          message: 'Server error. Please try again later.',
          status,
        });
      default:
        return Promise.reject({
          code: 'UNKNOWN_ERROR',
          message: data.error?.message || 'An unexpected error occurred',
          status,
        });
    }
  }
);

// Cancel token source for request cancellation
export const cancelRequests = () => {
  const source = axios.CancelToken.source();
  return source;
};
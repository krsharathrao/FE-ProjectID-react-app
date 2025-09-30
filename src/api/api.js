import axios from 'axios';
import { getUserInfo, handleAuthError } from '../utils/auth';

const api = axios.create({
  baseURL:'https://backend-app-service-e0e0bzg6eahnh8hr.centralindia-01.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const userInfo = getUserInfo();

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle API errors globally
api.interceptors.response.use(
  // If the request was successful, just return the response
  (response) => response,
  // If there was an error, parse it and return a standardized error message
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      // Use auth utility to handle logout and redirect
      handleAuthError();
      
      return Promise.reject({ 
        message: 'Your session has expired. Please log in again.',
        status: 401 
      });
    }

    // Handle network errors (no response from server)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      handleAuthError();
      // For network errors, check if we have a token but can't reach server
      // This might indicate the server is down or network issues
      const userInfo = getUserInfo();
      if (userInfo && userInfo.token) {
        // We have a token but can't reach the server - this is a network issue, not auth issue
        return Promise.reject({ 
          message: 'Could not connect to the server. Please check your network connection.',
          code: 'NETWORK_ERROR'
        });
      } else {
        // No token and network error - might be auth related, redirect to login
        handleAuthError();
        return Promise.reject({ 
          message: 'Network error. Please log in again.',
          code: 'NETWORK_ERROR'
        });
      }
    }

    // If the error has a response and data, pass it along.
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }

    // Handle other errors
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject({ message: errorMessage });
  }
);

export default api;

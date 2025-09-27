// Authentication utility functions
import { showWarning } from './notification';

/**
 * Get user info from localStorage
 */
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error parsing user info from localStorage:', error);
    return null;
  }
};

/**
 * Set user info in localStorage
 */
export const setUserInfo = (userInfo) => {
  try {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    console.error('Error saving user info to localStorage:', error);
  }
};

/**
 * Clear user info and redirect to login
 */
export const logout = (redirectToLogin = true) => {
  // Clear user data
  localStorage.removeItem('userInfo');
  
  // Clear any other auth-related data if needed
  // localStorage.removeItem('refreshToken');
  
  // Redirect to login page if requested
  if (redirectToLogin) {
    window.location.href = '/login';
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const userInfo = getUserInfo();
  return userInfo && userInfo.token;
};

/**
 * Check if token is expired (basic check)
 * This is a simple implementation - you might want to decode JWT for more accurate expiry check
 */
export const isTokenExpired = () => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.token) {
    return true;
  }
  
  // If you have token expiry info, check it here
  // For now, we'll rely on the server to return 401 when token is expired
  return false;
};

/**
 * Handle authentication error (401)
 */
export const handleAuthError = () => {
  console.warn('Authentication failed - redirecting to login');
  
  // Show notification to user
  showWarning('Your session has expired. Redirecting to login...', 2000);
  
  // Delay redirect slightly to allow user to see the notification
  setTimeout(() => {
    logout(true);
  }, 2000);
};

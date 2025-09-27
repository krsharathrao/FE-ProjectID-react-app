// Test utilities for authentication scenarios
import api from '../api/api';

/**
 * Test function to simulate a 401 error
 * This can be called from browser console to test the auth flow
 */
export const simulate401Error = () => {
  console.log('🧪 Simulating 401 Unauthorized error...');
  
  // Import the auth handler
  import('./auth.js').then(({ handleAuthError }) => {
    handleAuthError();
  });
};

/**
 * Test API call with current token to see if it's valid
 */
export const testCurrentToken = async () => {
  console.log('🧪 Testing current token with API call...');
  
  try {
    const response = await api.get('/BusinessUnits');
    console.log('✅ Token is valid - API call successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ API call failed:', error);
    return { success: false, error };
  }
};

/**
 * Test function to simulate an expired token
 * This modifies the token in localStorage to be invalid
 */
export const simulateExpiredToken = () => {
  console.log('🧪 Simulating expired token...');
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  if (userInfo.token) {
    // Modify the token to make it invalid
    userInfo.token = 'expired_' + userInfo.token;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    console.log('Token modified to simulate expiry. Next API call should return 401.');
  } else {
    console.log('No token found in localStorage');
  }
};

/**
 * Test function to check current auth state
 */
export const checkAuthState = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  console.log('🔍 Current auth state:', {
    hasUserInfo: !!userInfo,
    hasToken: !!userInfo.token,
    tokenPreview: userInfo.token ? userInfo.token.substring(0, 20) + '...' : 'No token',
    currentPath: window.location.pathname
  });
};

/**
 * Test the notification system
 */
export const testNotifications = () => {
  console.log('🧪 Testing notification system...');
  
  import('./notification.js').then(({ showSuccess, showError, showWarning, showInfo }) => {
    setTimeout(() => showInfo('Test info notification'), 0);
    setTimeout(() => showSuccess('Test success notification'), 1000);
    setTimeout(() => showWarning('Test warning notification'), 2000);
    setTimeout(() => showError('Test error notification'), 3000);
  });
};

/**
 * Complete test scenario for 401 handling
 */
export const runCompleteAuthTest = async () => {
  console.log('🚀 Running complete authentication test...');
  
  // Step 1: Check current state
  console.log('\n📋 Step 1: Checking current auth state');
  checkAuthState();
  
  // Step 2: Test current token
  console.log('\n📋 Step 2: Testing current token');
  await testCurrentToken();
  
  // Step 3: Simulate expired token and test API call
  console.log('\n📋 Step 3: Simulating expired token');
  simulateExpiredToken();
  
  // Step 4: Test API call with expired token (should trigger 401)
  console.log('\n📋 Step 4: Testing API call with expired token (should trigger 401)');
  setTimeout(async () => {
    await testCurrentToken();
  }, 1000);
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.authTest = {
    simulate401Error,
    simulateExpiredToken,
    checkAuthState,
    testNotifications,
    testCurrentToken,
    runCompleteAuthTest
  };
  
  console.log('🧪 Auth test utilities loaded. Use window.authTest in console:');
  console.log('- window.authTest.simulate401Error() - Simulate 401 error');
  console.log('- window.authTest.simulateExpiredToken() - Make token invalid');
  console.log('- window.authTest.checkAuthState() - Check current auth state');
  console.log('- window.authTest.testNotifications() - Test notification system');
  console.log('- window.authTest.testCurrentToken() - Test API call with current token');
  console.log('- window.authTest.runCompleteAuthTest() - Run complete test scenario');
}

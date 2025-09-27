// Simple notification utility for showing user messages

/**
 * Show a temporary notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'warning', 'info')
 * @param {number} duration - How long to show the notification (in ms)
 */
export const showNotification = (message, type = 'info', duration = 4000) => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    z-index: 10000;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-family: 'Poppins', sans-serif;
  `;
  
  // Set background color based on type
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#007bff'
  };
  notification.style.backgroundColor = colors[type] || colors.info;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
};

/**
 * Show success notification
 */
export const showSuccess = (message, duration) => {
  showNotification(message, 'success', duration);
};

/**
 * Show error notification
 */
export const showError = (message, duration) => {
  showNotification(message, 'error', duration);
};

/**
 * Show warning notification
 */
export const showWarning = (message, duration) => {
  showNotification(message, 'warning', duration);
};

/**
 * Show info notification
 */
export const showInfo = (message, duration) => {
  showNotification(message, 'info', duration);
};

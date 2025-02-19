// Clear all form-related data from localStorage and state
export const clearAllFormData = () => {
  // Clear all localStorage items that contain form data
  const keysToKeep = ['theme']; // Add any keys that should not be cleared
  
  // Clear form-specific data with correct storage keys
  const STORAGE_KEYS = {
    PICKUP_ADDRESS: 'orderForm_pickupAddress',
    DROP_ADDRESS: 'orderForm_dropAddress',
    ITEMS: 'orderForm_items',
    DISTANCE: 'orderForm_distance',
    ACTIVE_TAB: 'orderForm_activeTab'
  };

  // Remove items with specific keys
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  // Remove any other form data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !keysToKeep.includes(key) && key.startsWith('orderForm_')) {
      localStorage.removeItem(key);
    }
  }

  // Clear URL state if any
  if (window.history.replaceState) {
    const cleanUrl = window.location.href.split('?')[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }
};

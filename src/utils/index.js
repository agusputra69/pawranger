import { PRICE_CONFIG, ANIMATION } from '../constants';

// Price formatting utility
export const formatPrice = (price) => {
  return new Intl.NumberFormat(PRICE_CONFIG.locale, {
    style: 'currency',
    currency: PRICE_CONFIG.currency,
    minimumFractionDigits: 0
  }).format(price);
};

// Smooth scroll utility
export const smoothScrollTo = (targetId) => {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
      return false;
    }
  }
};

// Array utilities
export const arrayUtils = {
  // Remove duplicates from array
  unique: (arr, key = null) => {
    if (key) {
      const seen = new Set();
      return arr.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      });
    }
    return [...new Set(arr)];
  },
  
  // Group array by key
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },
  
  // Sort array by multiple criteria
  sortBy: (arr, ...criteria) => {
    return arr.sort((a, b) => {
      for (const criterion of criteria) {
        let aVal, bVal, desc = false;
        
        if (typeof criterion === 'string') {
          aVal = a[criterion];
          bVal = b[criterion];
        } else if (typeof criterion === 'object') {
          aVal = a[criterion.key];
          bVal = b[criterion.key];
          desc = criterion.desc || false;
        }
        
        if (aVal < bVal) return desc ? 1 : -1;
        if (aVal > bVal) return desc ? -1 : 1;
      }
      return 0;
    });
  }
};

// Validation utilities
export const validation = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  phone: (phone) => {
    const phoneRegex = /^[+]?[1-9]?\d{9,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },
  
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  minLength: (value, min) => {
    return value && value.toString().length >= min;
  },
  
  maxLength: (value, max) => {
    return value && value.toString().length <= max;
  },
  
  numeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },
  
  positive: (value) => {
    return validation.numeric(value) && parseFloat(value) > 0;
  }
};

// Error handling utilities
export const errorUtils = {
  // Extract meaningful error message
  getErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;
    return 'An unexpected error occurred';
  },
  
  // Check if error is network related
  isNetworkError: (error) => {
    const networkErrors = ['NetworkError', 'TypeError', 'Failed to fetch'];
    const errorMessage = errorUtils.getErrorMessage(error);
    return networkErrors.some(netError => errorMessage.includes(netError));
  },
  
  // Retry with exponential backoff
  retryWithBackoff: async (fn, maxRetries = 3, baseDelay = 1000) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};

// DOM utilities
export const domUtils = {
  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  // Add event listener with cleanup
  addEventListener: (element, event, handler, options = {}) => {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
  },
  
  // Get element dimensions
  getDimensions: (element) => {
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom
    };
  }
};

// Date utilities
export const dateUtils = {
  // Format date for display
  formatDate: (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('id-ID', { ...defaultOptions, ...options });
  },
  
  // Format date and time
  formatDateTime: (date) => {
    return new Date(date).toLocaleString('id-ID');
  },
  
  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  }
};

// URL utilities
export const urlUtils = {
  // Build query string from object
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },
  
  // Parse query string to object
  parseQueryString: (queryString = window.location.search) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }
};

// All utilities are already exported above
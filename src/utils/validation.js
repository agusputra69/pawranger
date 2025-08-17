// Validation utilities
export const validation = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation (Indonesian format)
  phone: (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  },

  // Required field validation
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  // Minimum length validation
  minLength: (value, min) => {
    return value && value.toString().length >= min;
  },

  // Maximum length validation
  maxLength: (value, max) => {
    return value && value.toString().length <= max;
  },

  // Numeric validation
  numeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  // Positive number validation
  positiveNumber: (value) => {
    return validation.numeric(value) && parseFloat(value) > 0;
  },

  // File size validation
  fileSize: (file, maxSizeInBytes) => {
    return file && file.size <= maxSizeInBytes;
  },

  // File type validation
  fileType: (file, allowedTypes) => {
    return file && allowedTypes.includes(file.type);
  },

  // Date validation (not in the past)
  futureDate: (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  },

  // Password strength validation
  passwordStrength: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      strength: {
        length: password.length >= minLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        numbers: hasNumbers,
        specialChar: hasSpecialChar
      }
    };
  }
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      if (typeof rule === 'function') {
        const result = rule(value);
        if (!result.isValid) {
          errors[field] = result.message;
        }
      } else if (typeof rule === 'object') {
        const { validator, message } = rule;
        if (!validator(value)) {
          errors[field] = message;
        }
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required') => ({
    validator: validation.required,
    message
  }),
  
  email: (message = 'Please enter a valid email address') => ({
    validator: validation.email,
    message
  }),
  
  phone: (message = 'Please enter a valid phone number') => ({
    validator: validation.phone,
    message
  }),
  
  minLength: (min, message) => ({
    validator: (value) => validation.minLength(value, min),
    message: message || `Minimum ${min} characters required`
  }),
  
  maxLength: (max, message) => ({
    validator: (value) => validation.maxLength(value, max),
    message: message || `Maximum ${max} characters allowed`
  })
};
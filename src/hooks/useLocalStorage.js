import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils';

/**
 * Custom hook for managing localStorage with React state synchronization
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[value, setValue, removeValue]} - Current value, setter function, and remove function
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    return storage.get(key, initialValue);
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      storage.remove(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for managing arrays in localStorage
 * @param {string} key - The localStorage key
 * @param {Array} initialValue - Initial array value
 * @returns {Object} - Object with array operations
 */
export const useLocalStorageArray = (key, initialValue = []) => {
  const [array, setArray] = useLocalStorage(key, initialValue);

  const addItem = useCallback((item) => {
    setArray(currentArray => [...currentArray, item]);
  }, [setArray]);

  const removeItem = useCallback((index) => {
    setArray(currentArray => currentArray.filter((_, i) => i !== index));
  }, [setArray]);

  const removeItemById = useCallback((id, idKey = 'id') => {
    setArray(currentArray => currentArray.filter(item => item[idKey] !== id));
  }, [setArray]);

  const updateItem = useCallback((index, newItem) => {
    setArray(currentArray => 
      currentArray.map((item, i) => i === index ? newItem : item)
    );
  }, [setArray]);

  const updateItemById = useCallback((id, newItem, idKey = 'id') => {
    setArray(currentArray => 
      currentArray.map(item => 
        item[idKey] === id ? { ...item, ...newItem } : item
      )
    );
  }, [setArray]);

  const clearArray = useCallback(() => {
    setArray([]);
  }, [setArray]);

  const findItem = useCallback((predicate) => {
    return array.find(predicate);
  }, [array]);

  const findItemById = useCallback((id, idKey = 'id') => {
    return array.find(item => item[idKey] === id);
  }, [array]);

  return {
    array,
    setArray,
    addItem,
    removeItem,
    removeItemById,
    updateItem,
    updateItemById,
    clearArray,
    findItem,
    findItemById,
    length: array.length,
    isEmpty: array.length === 0
  };
};

/**
 * Hook for managing objects in localStorage
 * @param {string} key - The localStorage key
 * @param {Object} initialValue - Initial object value
 * @returns {Object} - Object with object operations
 */
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [object, setObject] = useLocalStorage(key, initialValue);

  const updateProperty = useCallback((property, value) => {
    setObject(currentObject => ({
      ...currentObject,
      [property]: value
    }));
  }, [setObject]);

  const removeProperty = useCallback((property) => {
    setObject(currentObject => {
      const { [property]: _, ...rest } = currentObject;
      return rest;
    });
  }, [setObject]);

  const mergeObject = useCallback((newProperties) => {
    setObject(currentObject => ({
      ...currentObject,
      ...newProperties
    }));
  }, [setObject]);

  const clearObject = useCallback(() => {
    setObject({});
  }, [setObject]);

  const hasProperty = useCallback((property) => {
    return Object.prototype.hasOwnProperty.call(object, property);
  }, [object]);

  const getProperty = useCallback((property, defaultValue = null) => {
    return object[property] ?? defaultValue;
  }, [object]);

  return {
    object,
    setObject,
    updateProperty,
    removeProperty,
    mergeObject,
    clearObject,
    hasProperty,
    getProperty,
    keys: Object.keys(object),
    values: Object.values(object),
    entries: Object.entries(object),
    isEmpty: Object.keys(object).length === 0
  };
};
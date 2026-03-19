import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persistent state backed by localStorage.
 *
 * Reads the stored JSON value on first render (falling back to initialValue),
 * and writes back to localStorage whenever the value changes.
 *
 * @param {string} key - The localStorage key.
 * @param {*} initialValue - Default value when nothing is stored yet.
 * @returns {[*, function]} A stateful value and its setter (same API as useState).
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(
        `useLocalStorage: failed to read key "${key}" from localStorage`,
        error,
      );
      return initialValue;
    }
  });

  // Sync to localStorage whenever key or storedValue changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(
        `useLocalStorage: failed to write key "${key}" to localStorage`,
        error,
      );
    }
  }, [key, storedValue]);

  // Stable setter that mirrors the useState API (accepts value or updater fn).
  const setValue = useCallback((value) => {
    setStoredValue((prev) =>
      typeof value === 'function' ? value(prev) : value,
    );
  }, []);

  return [storedValue, setValue];
}

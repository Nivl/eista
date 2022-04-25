import { useEffect, useState } from 'react';

export function useLocalStorage<Type>(
  key: string,
  defaultValue?: Type,
  opts?: { subscribe?: boolean },
): [Type, (value: Type) => void] {
  const [data, setData] = useState<Type>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return defaultValue;
      }

      return JSON.parse(value);
    } catch (e) {
      console.error(e); //eslint-disable-line no-console
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      switch (data) {
        case undefined:
        case defaultValue:
          localStorage.removeItem(key);
          break;
        default:
          localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      console.error(e); //eslint-disable-line no-console
    }
  }, [key, defaultValue, data]);

  useEffect(() => {
    if (typeof window === 'undefined' || !opts?.subscribe) {
      return;
    }

    const onChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) {
        return;
      }

      try {
        setData(e.newValue ? JSON.parse(e.newValue) : defaultValue);
      } catch (e) {
        console.error(e); //eslint-disable-line no-console
      }
    };

    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, [key, defaultValue, opts?.subscribe]);

  return [data, setData];
}

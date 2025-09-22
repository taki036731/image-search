import { useState, useCallback } from "react";

const isBrowser = typeof document !== "undefined";

function getCookie(name: string): string | undefined {
  if (!isBrowser) {
    return undefined;
  }
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function setCookie(name:string, value:string, days:number = 365) {
    if (!isBrowser) {
        return;
    }
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
}

export function useCookieState<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const cookieValue = getCookie(key);
    if (cookieValue) {
      try {
        return JSON.parse(cookieValue) as T;
      } catch (error) {
        console.warn(`Error parsing cookie "${key}":`, error);
      }
    }
    return defaultValue;
  });

  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      setCookie(key, JSON.stringify(valueToStore));
    },
    [key, value]
  );

  return [value, updateValue];
}
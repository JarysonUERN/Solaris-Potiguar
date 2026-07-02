import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "theme";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light") return true;
  return false;
}

export function useTheme() {
  const [isLight, setIsLight] = useState(getInitialTheme);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [isLight]);

  const toggle = useCallback(() => {
    setIsLight((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
      return next;
    });
  }, []);

  return { isLight, toggle };
}

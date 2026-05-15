"use client";

const DARK_KEY = "sc900-dark";

export function getDarkMode(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem(DARK_KEY);
  if (v === null) return true;
  return v === "true";
}

export function setDarkMode(enabled: boolean): void {
  localStorage.setItem(DARK_KEY, enabled ? "true" : "false");
  if (enabled) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export { getDarkMode as getDarkModeForStorage, setDarkMode as setDarkModeForStorage };

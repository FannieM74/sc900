"use client";

const BOOKMARKS_KEY = "sc900-bookmarks";
const HISTORY_KEY = "sc900-history";
const MISSED_KEY = "sc900-missed";
const FLAGGED_KEY = "sc900-flagged";
const ATTEMPTS_KEY = "sc900-attempts";
const DARK_KEY = "sc900-dark";

// -- Bookmarks --
export function getBookmarks(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleBookmark(id: number): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(id);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return false;
  } else {
    bookmarks.push(id);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return true;
  }
}

export function isBookmarked(id: number): boolean {
  return getBookmarks().includes(id);
}

// -- Quiz History --
export interface QuizRecord {
  date: string;
  score: number;
  total: number;
  topic?: string;
}

export function saveQuizRecord(record: QuizRecord): void {
  const history = getQuizHistory();
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

export function getQuizHistory(): QuizRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

// -- Missed Questions --
export function getMissedQuestions(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MISSED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addMissedQuestions(ids: number[]): void {
  const missed = new Set(getMissedQuestions());
  for (const id of ids) missed.add(id);
  localStorage.setItem(MISSED_KEY, JSON.stringify(Array.from(missed)));
}

export function removeMissedQuestion(id: number): void {
  const missed = getMissedQuestions().filter((x) => x !== id);
  localStorage.setItem(MISSED_KEY, JSON.stringify(missed));
}

export function clearMissedQuestions(): void {
  localStorage.setItem(MISSED_KEY, "[]");
}

// -- Flagged Questions --
export function getFlagged(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FLAGGED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFlag(id: number): boolean {
  const flagged = getFlagged();
  const idx = flagged.indexOf(id);
  if (idx >= 0) {
    flagged.splice(idx, 1);
    localStorage.setItem(FLAGGED_KEY, JSON.stringify(flagged));
    return false;
  } else {
    flagged.push(id);
    localStorage.setItem(FLAGGED_KEY, JSON.stringify(flagged));
    return true;
  }
}

export function isFlagged(id: number): boolean {
  return getFlagged().includes(id);
}

// -- Per-Question Attempt Tracking --
export function recordAttempt(id: number, correct: boolean): void {
  const attempts = getAttempts();
  if (!attempts[id]) attempts[id] = { correct: 0, incorrect: 0 };
  if (correct) attempts[id].correct++;
  else attempts[id].incorrect++;
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {}
}

export function getAttempts(): Record<number, { correct: number; incorrect: number }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function clearAttempts(): void {
  try {
    localStorage.setItem(ATTEMPTS_KEY, "{}");
  } catch {}
}

// -- Dark Mode --
export function getDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DARK_KEY) === "true";
}

export function setDarkMode(enabled: boolean): void {
  localStorage.setItem(DARK_KEY, enabled ? "true" : "false");
  if (enabled) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

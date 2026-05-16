"use client";

import type { QuizRecord } from "@/lib/types";

const BOOKMARKS_KEY = "sc900-bookmarks";
const HISTORY_KEY = "sc900-history";
const MISSED_KEY = "sc900-missed";
const FLAGGED_KEY = "sc900-flagged";
const ATTEMPTS_KEY = "sc900-attempts";
const STORAGE_VERSION = 1;
const VERSION_KEY = "sc900-version";

function ensureStorageVersion(): void {
  if (typeof window === "undefined") return;
  try {
    const v = localStorage.getItem(VERSION_KEY);
    if (v !== String(STORAGE_VERSION)) {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("sc900-") && key !== VERSION_KEY) {
          localStorage.removeItem(key);
        }
      }
      localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
    }
  } catch {}
}

// -- Bookmarks --
export function getBookmarks(): number[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
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
  return new Set(getBookmarks()).has(id);
}

// -- Quiz History --

export function saveQuizRecord(record: QuizRecord): void {
  const history = getQuizHistory();
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

export function getQuizHistory(): QuizRecord[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

// -- Missed Questions --
export function getMissedQuestions(): number[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
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
  ensureStorageVersion();
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
  return new Set(getFlagged()).has(id);
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
  ensureStorageVersion();
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


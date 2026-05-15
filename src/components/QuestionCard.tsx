"use client";

import type { Question } from "@/lib/types";
import { isBookmarked, toggleBookmark, isFlagged, toggleFlag } from "@/lib/storage";
import { useState, useEffect, useCallback } from "react";
import TopicBadge from "@/components/TopicBadge";
import { linkify } from "@/lib/linkify";
import { optionLetter } from "@/lib/helpers";

interface Props {
  question: Question;
  selected: number | null;
  onSelect: (index: number) => void;
  mode: "quiz" | "review";
}

export default function QuestionCard({ question, selected, onSelect, mode }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(question.id));
    setFlagged(isFlagged(question.id));
  }, [question.id]);

  const handleBookmark = useCallback(() => {
    const now = toggleBookmark(question.id);
    setBookmarked(now);
  }, [question.id]);

  const handleFlag = useCallback(() => {
    const now = toggleFlag(question.id);
    setFlagged(now);
  }, [question.id]);

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="micro-uppercase">Question {question.id}</span>
          <TopicBadge topic={question.topic} />
        </div>
        <div className="flex items-center gap-2">
          {mode === "review" && (
            <button
              onClick={handleFlag}
              className="text-sm transition-opacity"
              style={{ opacity: flagged ? 1 : 0.3, color: flagged ? "var(--color-incorrect)" : "var(--color-muted)" }}
              aria-label={flagged ? "Remove flag" : "Flag question"}
            >
              {flagged ? "⚑" : "⚐"}
            </button>
          )}
          <button
            onClick={handleBookmark}
            className="text-lg transition-opacity"
            style={{ opacity: bookmarked ? 1 : 0.3, color: bookmarked ? "var(--color-brand-green)" : "var(--color-muted)" }}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark question"}
          >
            {bookmarked ? "★" : "☆"}
          </button>
        </div>
      </div>

      <h2 className="text-base font-semibold mb-6 leading-relaxed" style={{ color: "var(--color-ink)", fontWeight: 600, lineHeight: 1.5 }}>
        {question.question}
      </h2>

      <div className="space-y-2.5">
        {question.options.map((option, idx) => {
          const r = "var(--rounded-md)";

          if (mode === "review") {
            if (idx === question.correctAnswer) {
              return (
                <div key={idx} className="w-full text-left p-3 flex items-center gap-3 transition-all duration-150 text-sm font-medium"
                  style={{ borderRadius: r, border: "1px solid var(--color-brand-green)", backgroundColor: "var(--color-brand-green-soft)" }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold"
                    style={{ backgroundColor: "var(--color-brand-green)", color: "var(--color-canvas-dark)", borderRadius: "var(--rounded-sm)" }}>
                    {optionLetter(idx)}
                  </span>
                  <span style={{ color: "var(--color-ink)" }}>{option}</span>
                  <span className="ml-auto text-xs font-bold" style={{ color: "var(--color-brand-green-dark)" }}>✓ Correct</span>
                </div>
              );
            } else if (idx === selected && !isCorrect) {
              return (
                <div key={idx} className="w-full text-left p-3 flex items-center gap-3 transition-all duration-150 text-sm font-medium"
                  style={{ borderRadius: r, border: "1px solid var(--color-incorrect)", backgroundColor: "#fff5f5" }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold"
                    style={{ backgroundColor: "var(--color-incorrect)", color: "#fff", borderRadius: "var(--rounded-sm)" }}>
                    {optionLetter(idx)}
                  </span>
                  <span style={{ color: "var(--color-ink)" }}>{option}</span>
                </div>
              );
            } else {
              return (
                <div key={idx} className="w-full text-left p-3 flex items-center gap-3 transition-all duration-150 text-sm font-medium"
                  style={{ borderRadius: r, border: "1px solid var(--color-hairline)", backgroundColor: "var(--color-surface)" }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold"
                    style={{ backgroundColor: "var(--color-hairline)", color: "var(--color-slate)", borderRadius: "var(--rounded-sm)" }}>
                    {optionLetter(idx)}
                  </span>
                  <span style={{ color: "var(--color-slate)" }}>{option}</span>
                </div>
              );
            }
          } else {
            const isSelected = idx === selected;
            const bg = isSelected ? "var(--color-accent-blue)" : "var(--color-hairline)";
            const txt = isSelected ? "#fff" : "var(--color-slate)";
            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className="w-full text-left p-3 flex items-center gap-3 transition-all duration-150 text-sm font-medium"
                style={{
                  borderRadius: r,
                  border: isSelected ? "2px solid var(--color-accent-blue)" : "1px solid var(--color-hairline)",
                  backgroundColor: isSelected ? "#eef2ff" : "var(--color-surface)",
                  color: isSelected ? "var(--color-ink)" : "var(--color-slate)",
                }}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold"
                  style={{ backgroundColor: bg, color: txt, borderRadius: "var(--rounded-sm)" }}>
                  {optionLetter(idx)}
                </span>
                <span>{option}</span>
              </button>
            );
          }
        })}
      </div>

      {mode === "review" && (
        <div className="mt-6 p-4" style={{ borderRadius: "var(--rounded-md)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-hairline)" }}>
          <p className="text-sm font-medium mb-1" style={{ color: isCorrect ? "var(--color-brand-green-dark)" : "var(--color-incorrect)" }}>
            {isCorrect ? "Correct" : "Incorrect"}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-slate)" }}>{linkify(question.explanation)}</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { optionLetter } from "@/lib/helpers";
import TopicBadge from "@/components/TopicBadge";
import { linkify } from "@/lib/linkify";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const doSearch = (q: string) => {
    setQuery(q);
    clearTimeout(timer.current);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    timer.current = setTimeout(() => {
      setLoading(true);
      setSearched(true);
      const qs = allQuestions as Question[];
      const lower = q.toLowerCase();
      const res = qs.filter(
        (qq) =>
          qq.question.toLowerCase().includes(lower) ||
          qq.explanation.toLowerCase().includes(lower)
      );
      setResults(res);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }} className="inline-block mb-4">
          ← Home
        </Link>

        <h1 className="text-2xl font-bold mb-2" style={{ fontWeight: 700, lineHeight: 1.19 }}>🔍 Search Questions</h1>
        <p className="mb-6" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }}>Search questions and explanations by keyword.</p>

        <div className="relative mb-6">
          <input
            type="search"
            value={query}
            onChange={(e) => doSearch(e.target.value)}
            placeholder="Search for anything..."
            className="w-full pl-10 search-pill"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }}>🔍</span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-hairline)", borderTopColor: "var(--color-brand-green)" }} />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-8">
            <p style={{ color: "var(--color-steel)" }}>No results found for &ldquo;{query}&rdquo;</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="micro-uppercase">{results.length} result{results.length !== 1 ? "s" : ""}</p>
            {results.map((q) => {
              return (
                <div key={q.id} className="card p-5">
                  <p className="font-semibold mb-2" style={{ color: "var(--color-ink)", fontWeight: 600, lineHeight: 1.5 }}>{q.question}</p>
                  <TopicBadge topic={q.topic} />
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className="p-2.5 flex items-center gap-2 text-sm"
                        style={{
                          borderRadius: "var(--rounded-md)",
                          backgroundColor: i === q.correctAnswer ? "var(--color-brand-green-soft)" : "var(--color-surface)",
                          border: i === q.correctAnswer ? "1px solid var(--color-brand-green)" : "1px solid var(--color-hairline)",
                          color: i === q.correctAnswer ? "var(--color-brand-green-dark)" : "var(--color-steel)",
                        }}
                      >
                        <span className="font-medium mr-1 text-xs">{optionLetter(i)}.</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm p-3" style={{ borderRadius: "var(--rounded-md)", backgroundColor: "var(--color-surface)", color: "var(--color-slate)" }}>
                    {linkify(q.explanation)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

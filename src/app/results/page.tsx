"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getQuizHistory } from "@/lib/storage";
import { TOPIC_LABELS } from "@/lib/topics";
import type { QuizRecord } from "@/lib/types";

function ResultsContent() {
  const searchParams = useSearchParams();
  const scoreParam = parseInt(searchParams.get("score") || "0");
  const totalParam = parseInt(searchParams.get("total") || "0");

  const [history, setHistory] = useState<QuizRecord[]>([]);

  useEffect(() => {
    setHistory(getQuizHistory());
  }, []);

  const latestPct = totalParam > 0 ? Math.round((scoreParam / totalParam) * 100) : 0;

  const latestMessage = latestPct >= 80 ? "Excellent!" : latestPct >= 60 ? "Good effort!" : "Keep practicing!";

  const topicLabel = (t?: string) => TOPIC_LABELS[t || ""] || t || "";

  const today = new Date().toDateString();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }} className="inline-block mb-4">
          ← Home
        </Link>

        <h1 className="text-2xl font-bold mb-6" style={{ fontWeight: 700, lineHeight: 1.19 }}>📊 Quiz History</h1>

        {totalParam > 0 && (
          <div className="card p-6 text-center mb-8">
            <p className="text-5xl mb-2">{latestPct >= 80 ? "🎉" : latestPct >= 60 ? "👍" : "💪"}</p>
            <h2 className="text-xl font-bold" style={{
              color: latestPct >= 80 ? "var(--color-brand-green)" : latestPct >= 60 ? "var(--color-accent-blue)" : "#d29922"
            }}>
              {latestMessage}
            </h2>
            <p className="mt-1" style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>{today}</p>
            <div className="flex items-center justify-center gap-1 my-4">
              <span className="text-4xl font-bold" style={{ color: "var(--color-ink)" }}>{scoreParam}</span>
              <span className="text-xl" style={{ color: "var(--color-muted)" }}>/</span>
              <span className="text-2xl" style={{ color: "var(--color-muted)" }}>{totalParam}</span>
            </div>
            <div className="w-full h-2 mb-2 overflow-hidden max-w-xs mx-auto progress-track" style={{ borderRadius: "9999px" }}>
              <div className="h-full" style={{
                width: `${latestPct}%`,
                backgroundColor: latestPct >= 80 ? "var(--color-brand-green)" : latestPct >= 60 ? "var(--color-accent-blue)" : "#d29922",
                borderRadius: "9999px"
              }} />
            </div>
            <p className="text-xl font-bold mb-6" style={{ color: "var(--color-ink)" }}>{latestPct}%</p>
          </div>
        )}

        {history.length === 0 && totalParam === 0 && (
          <div className="text-center py-12">
            <p className="mb-2" style={{ color: "var(--color-steel)", fontSize: "1.125rem" }}>No quiz history yet</p>
            <p className="mb-4" style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>Complete a quiz to see your scores here</p>
            <Link href="/quiz" className="btn-primary">Start Quiz</Link>
          </div>
        )}

        {history.length > 0 && (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 hairline-bottom">
              <h3 className="font-semibold" style={{ color: "var(--color-ink)", fontWeight: 600, lineHeight: 1.21 }}>Past Results</h3>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--color-hairline-soft)" }}>
              {history.map((r, i) => {
                const pct = Math.round((r.score / r.total) * 100);
                return (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span>{pct >= 80 ? "🟢" : pct >= 60 ? "🟡" : "🔴"}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                          {r.score}/{r.total}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-stone)" }}>
                          {new Date(r.date).toLocaleDateString()}
                          {` · ${topicLabel(r.topic)}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: pct >= 80 ? "var(--color-brand-green)" : pct >= 60 ? "var(--color-accent-blue)" : "#d29922" }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link href="/quiz" className="btn-primary flex-1 text-center">New Quiz</Link>
          <Link href="/" className="btn-secondary flex-1 text-center">Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-canvas)" }}><p style={{ color: "var(--color-steel)" }}>Loading...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}

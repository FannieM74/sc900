"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { getFlagged, toggleFlag } from "@/lib/storage";
import QuestionCard from "@/components/QuestionCard";
import Skeleton from "@/components/Skeleton";

const qs = allQuestions as Question[];

export default function FlaggedPage() {
  const [allQ, setAllQ] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const ids = getFlagged();
    const qMap = new Map(qs.map((q) => [q.id, q]));
    setAllQ(ids.map((id) => qMap.get(id)).filter(Boolean) as Question[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleUnflag = (id: number) => {
    toggleFlag(id);
    refresh();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }} className="inline-block mb-4">
          ← Home
        </Link>
        <h1 className="text-2xl font-bold mb-2" style={{ fontWeight: 700, lineHeight: 1.19 }}>❓ Flagged Questions</h1>
        <p className="mb-6" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }}>Questions you&apos;ve flagged during quiz review.</p>

        {loading ? (
          <div className="space-y-6"><Skeleton /><Skeleton /></div>
        ) : allQ.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-2" style={{ color: "var(--color-steel)", fontSize: "1.125rem" }}>No flagged questions</p>
            <p className="mb-4" style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>Flag questions during quiz review to find them here.</p>
            <Link href="/quiz" className="btn-primary">Take a Quiz</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {allQ.map((q) => (
              <div key={q.id}>
                <div className="flex justify-end mb-1">
                  <button onClick={() => handleUnflag(q.id)} className="btn-ghost text-sm" style={{ color: "var(--color-steel)" }}>Remove flag</button>
                </div>
                <QuestionCard question={q} selected={q.correctAnswer} onSelect={() => {}} mode="review" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

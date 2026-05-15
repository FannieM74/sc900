"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { getMissedQuestions, clearMissedQuestions } from "@/lib/storage";
import QuestionCard from "@/components/QuestionCard";
import Skeleton from "@/components/Skeleton";

const qs = allQuestions as Question[];

export default function ReviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    const ids = getMissedQuestions();
    if (ids.length === 0) {
      setLoading(false);
      setQuestions([]);
      return;
    }
    const qMap = new Map(qs.map((q) => [q.id, q]));
    setQuestions(ids.map((id) => qMap.get(id)).filter(Boolean) as Question[]);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleClear = () => {
    clearMissedQuestions();
    refresh();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }} className="inline-block mb-4">
          ← Home
        </Link>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold" style={{ fontWeight: 700, lineHeight: 1.19 }}>❌ Review Mistakes</h1>
          {questions.length > 0 && (
            <button onClick={handleClear} className="btn-ghost" style={{ color: "var(--color-steel)" }}>Clear all</button>
          )}
        </div>
        <p className="mb-6" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }}>
          {questions.length > 0 ? `${questions.length} question${questions.length > 1 ? "s" : ""} to review` : "No missed questions — great job!"}
        </p>

        {loading ? (
          <div className="space-y-6"><Skeleton /><Skeleton /><Skeleton /></div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-2" style={{ color: "var(--color-steel)", fontSize: "1.125rem" }}>All clear!</p>
            <p className="mb-4" style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>No questions to review right now.</p>
            <Link href="/quiz" className="btn-primary">Take a Quiz</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} selected={null} onSelect={() => {}} mode="review" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

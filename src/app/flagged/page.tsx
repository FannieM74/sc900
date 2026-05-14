"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchQuestionsByIds } from "@/lib/api";
import { getFlagged, toggleFlag } from "@/lib/storage";
import type { Question } from "@/lib/api";
import TopicBadge from "@/components/TopicBadge";
import { linkify } from "@/lib/linkify";

export default function FlaggedPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    const ids = getFlagged();
    if (ids.length === 0) {
      setQuestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchQuestionsByIds(ids)
      .then(setQuestions)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const handleUnflag = (id: number) => {
    toggleFlag(id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← Home
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">❓ Flagged Questions</h1>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {!loading && questions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">No flagged questions</p>
            <p className="text-gray-400 text-sm mb-4">
              Flag questions that seem incorrect during review to check them later.
            </p>
            <Link href="/"
              className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
              Home
            </Link>
          </div>
        )}

        {!loading && questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium mb-2">{q.question}</p>
                    <TopicBadge topic={q.topic} />
                  </div>
                  <button onClick={() => handleUnflag(q.id)}
                    className="text-xs text-gray-400 hover:text-red-600 shrink-0 mt-1">
                    Remove flag
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`p-2.5 rounded-lg text-sm ${
                      i === q.correctAnswer
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-gray-50 border border-gray-200 text-gray-700"
                    }`}>
                      <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-500 bg-blue-50 rounded-lg p-3">
                  {linkify(q.explanation)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

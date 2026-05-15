"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { getBookmarks } from "@/lib/storage";
import QuestionCard from "@/components/QuestionCard";
import Skeleton from "@/components/Skeleton";

const qs = allQuestions as Question[];

export default function BookmarksPage() {
  const [allQ, setAllQ] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getBookmarks();
    const qMap = new Map(qs.map((q) => [q.id, q]));
    setAllQ(ids.map((id) => qMap.get(id)).filter(Boolean) as Question[]);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }} className="inline-block mb-4">
          ← Home
        </Link>
        <h1 className="text-2xl font-bold mb-2" style={{ fontWeight: 700, lineHeight: 1.19 }}>★ Bookmarks</h1>
        <p className="mb-6" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }}>Questions you&apos;ve bookmarked for later review.</p>

        {loading ? (
          <div className="space-y-6"><Skeleton /><Skeleton /></div>
        ) : allQ.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-2" style={{ color: "var(--color-steel)", fontSize: "1.125rem" }}>No bookmarks yet</p>
            <p className="mb-4" style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>Bookmark questions during study or quiz review to find them here.</p>
            <Link href="/study" className="btn-primary">Browse Questions</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {allQ.map((q) => (
              <QuestionCard key={q.id} question={q} selected={q.correctAnswer} onSelect={() => {}} mode="review" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

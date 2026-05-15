"use client";

import { useState } from "react";
import Link from "next/link";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/topics";
import QuestionCard from "@/components/QuestionCard";
import Skeleton from "@/components/Skeleton";

const qs = allQuestions as Question[];

export default function StudyPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = topic ? qs.filter((q) => q.topic === topic) : qs;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }} className="inline-block mb-4">
          ← Home
        </Link>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold" style={{ fontWeight: 700, lineHeight: 1.19 }}>📖 Study Mode</h1>
          <select value={topic} onChange={(e) => { setTopic(e.target.value); setLoading(true); setTimeout(() => setLoading(false), 0); }} className="w-44">
            <option value="">All Topics</option>
            {Object.keys(TOPIC_LABELS).filter(k => k).map((k) => (
              <option key={k} value={k}>{TOPIC_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <p className="mb-6" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }}>{filtered.length} questions</p>

        {loading ? (
          <div className="space-y-6"><Skeleton /><Skeleton /><Skeleton /></div>
        ) : (
          <div className="space-y-6">
            {filtered.map((q) => (
              <QuestionCard key={q.id} question={q} selected={q.correctAnswer} onSelect={() => {}} mode="review" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { getQuizHistory } from "@/lib/storage";
import type { QuizRecord } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/topics";
import TopicBadge from "@/components/TopicBadge";

const qs = allQuestions as Question[];

const topicsTotal: Record<string, number> = {};
for (const q of qs) topicsTotal[q.topic] = (topicsTotal[q.topic] || 0) + 1;

const COUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 50, 131];

const navLinks = [
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/study", label: "Study", icon: "📖" },
  { href: "/review", label: "Review", icon: "❌" },
  { href: "/bookmarks", label: "Bookmarks", icon: "★" },
  { href: "/flagged", label: "Flagged", icon: "❓" },
  { href: "/analysis", label: "Analysis", icon: "📈" },
  { href: "/results", label: "History", icon: "📊" },
];

export default function HomePage() {
  const [history, setHistory] = useState<QuizRecord[]>([]);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHistory(getQuizHistory());
    setMounted(true);
  }, []);

  const bestScore = history.length > 0
    ? Math.max(...history.map((r) => Math.round((r.score / r.total) * 100)))
    : null;

  function quizHref() {
    const params = new URLSearchParams();
    if (topic) params.set("topic", topic);
    if (count !== 131) params.set("count", String(count));
    return `/quiz?${params.toString()}`;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>

      {/* Dark hero band */}
      <div className="hero-dark">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-20 text-center">
          <h1
            className="font-bold leading-[1.10] tracking-[-1.5px]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            SC-900
          </h1>
          <p className="mt-3" style={{ color: "var(--color-on-dark-muted)", fontSize: "1.125rem", lineHeight: 1.5 }}>
            Security, Compliance &amp; Identity Fundamentals
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg mx-auto">
            <div className="card-dark p-6 text-center" style={{ border: "1px solid var(--color-hairline-dark)" }}>
              <p className="font-bold leading-[1.17]" style={{ fontSize: "1.75rem" }}>{qs.length}</p>
              <p className="text-sm mt-2" style={{ color: "var(--color-on-dark-muted)" }}>Questions</p>
            </div>
            <div className="card-dark p-6 text-center" style={{ border: "1px solid var(--color-hairline-dark)" }}>
              <p className="font-bold leading-[1.17]" style={{ fontSize: "1.75rem" }}>{mounted ? history.length : "—"}</p>
              <p className="text-sm mt-2" style={{ color: "var(--color-on-dark-muted)" }}>Quizzes Taken</p>
            </div>
            <div className="card-dark p-6 text-center" style={{ border: "1px solid var(--color-hairline-dark)" }}>
              <p className="font-bold leading-[1.17]" style={{ fontSize: "1.75rem" }}>
                {mounted && bestScore !== null ? `${bestScore}%` : "—"}
              </p>
              <p className="text-sm mt-2" style={{ color: "var(--color-on-dark-muted)" }}>Best Score</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-6" style={{ marginTop: "-1.5rem", paddingBottom: "3rem" }}>

        {/* Start Quiz */}
        <section className="mb-8">
          <p className="micro-uppercase mb-3">Quiz</p>
          <div className="card p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="micro-uppercase block mb-2">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Topics</option>
                  {Object.keys(topicsTotal).map((t) => (
                    <option key={t} value={t}>{TOPIC_LABELS[t] || t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="micro-uppercase block mb-2">Questions</label>
                <select
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full"
                >
                  {COUNT_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c === 131 ? `All (${c})` : c}</option>
                  ))}
                </select>
              </div>
            </div>
            <Link href={quizHref()} className="btn-primary w-full">Start Quiz</Link>
            <Link href="/quiz?daily=true" className="btn-secondary w-full mt-3">Daily Challenge</Link>
          </div>
        </section>

        {/* Topics */}
        <section className="mb-8">
          <p className="micro-uppercase mb-3">Topics</p>
          <div className="card p-6">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(topicsTotal).map(([key, cnt]) => (
                <Link
                  key={key}
                  href={`/quiz?topic=${key}&count=131`}
                  className="flex items-center justify-between p-3 transition-all button"
                  style={{ borderRadius: "var(--rounded-md)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-hairline)" }}
                >
                  <TopicBadge topic={key} />
                  <span style={{ color: "var(--color-steel)", fontSize: "0.8125rem" }}>{cnt} q</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section>
          <p className="micro-uppercase mb-3">Navigate</p>
          <div className="flex flex-wrap gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="btn-secondary"
                style={{ gap: "6px", padding: "8px 14px" }}
              >
                <span style={{ fontSize: "1rem", lineHeight: 1 }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchStats } from "@/lib/api";
import { getQuizHistory, getDarkMode, setDarkMode, type QuizRecord } from "@/lib/storage";
import TopicBadge from "@/components/TopicBadge";

const COUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 50, 91];
const TOPIC_LABELS: Record<string, string> = {
  "": "All Topics",
  "security-concepts": "Security Concepts",
  "identity": "Identity",
  "compliance": "Compliance",
  "azure-security": "Azure Security",
};

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<{ total: number; topics: Record<string, number> } | null>(null);
  const [history, setHistory] = useState<QuizRecord[]>([]);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetchStats().then(setStats);
    setHistory(getQuizHistory());
    setDark(getDarkMode());
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    setDarkMode(next);
  };

  const bestScore = history.length > 0
    ? Math.max(...history.map((r) => Math.round((r.score / r.total) * 100)))
    : null;

  const startQuiz = () => {
    const params = new URLSearchParams();
    if (topic) params.set("topic", topic);
    if (count !== 91) params.set("count", String(count));
    router.push(`/quiz?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">
          <h1 className="text-3xl font-bold text-gray-900">SC-900 Quiz</h1>
          <p className="text-gray-500 mt-1">Security, Compliance & Identity Fundamentals</p>
          <button onClick={toggleDark} className="absolute top-0 right-0 text-xl" aria-label="Toggle dark mode">
            {dark ? "☀️" : "🌙"}
          </button>
        </header>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats?.total ?? "—"}</p>
            <p className="text-xs text-gray-500 mt-1">Questions</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{history.length}</p>
            <p className="text-xs text-gray-500 mt-1">Quizzes Taken</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {bestScore !== null ? `${bestScore}%` : "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Best Score</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Start Quiz</h2>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Topics</option>
                {stats && Object.keys(stats.topics).map((t) => (
                  <option key={t} value={t}>{TOPIC_LABELS[t] || t}</option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-gray-500 mb-1">Questions</label>
              <select
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {COUNT_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c === 91 ? `All (${c})` : c}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={startQuiz}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
          <button
            onClick={() => router.push("/quiz?daily=true")}
            className="w-full mt-2 py-3 rounded-lg border border-blue-300 text-blue-700 font-medium hover:bg-blue-50 transition-colors"
          >
            🏆 Daily Quiz
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Topics</h2>
          <div className="grid grid-cols-2 gap-3">
            {stats && Object.entries(stats.topics).map(([key, cnt]) => (
              <button
                key={key}
                onClick={() => { setTopic(key); setCount(91); }}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <TopicBadge topic={key} />
                <span className="text-sm text-gray-500">{cnt} questions</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Link href="/search" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
            🔍 Search
          </Link>
          <Link href="/study" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
            📖 Study
          </Link>
          <Link href="/review" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
            ❌ Review
          </Link>
          <Link href="/bookmarks" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
            ★ Bookmarks
          </Link>
          <Link href="/flagged" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
            ❓ Flagged
          </Link>
          <Link href="/analysis" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
            📈 Analysis
          </Link>
          <Link href="/results" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
            📊 History
          </Link>
        </div>
      </div>
    </div>
  );
}

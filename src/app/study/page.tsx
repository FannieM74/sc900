"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/api";
import { fetchQuestions, fetchStats } from "@/lib/api";
import TopicBadge from "@/components/TopicBadge";
import { linkify } from "@/lib/linkify";

const TOPIC_LABELS: Record<string, string> = {
  "security-concepts": "Security Concepts",
  "identity": "Identity",
  "compliance": "Compliance",
  "azure-security": "Azure Security",
};

export default function StudyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then((s) => setTopics(Object.keys(s.topics))).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchQuestions(topic || undefined)
      .then(setQuestions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [topic]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← Home
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📖 Study Mode</h1>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>{TOPIC_LABELS[t] || t}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <p className="text-sm text-gray-500 mb-4">{questions.length} question{questions.length !== 1 ? "s" : ""}</p>
        )}

        {!loading && (
          <div className="space-y-4">
            {questions.map((q) => {
              const correct = q.options[q.correctAnswer];
              return (
                <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <p className="text-gray-900 font-medium mb-2">{q.question}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <TopicBadge topic={q.topic} />
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-2.5 rounded-lg text-sm ${
                        i === q.correctAnswer
                          ? "bg-green-50 border border-green-200 text-green-800 font-medium"
                          : "bg-gray-50 border border-gray-200 text-gray-700"
                      }`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                        {i === q.correctAnswer && (
                          <span className="ml-2 text-xs text-green-600">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-gray-500 bg-blue-50 rounded-lg p-3">
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

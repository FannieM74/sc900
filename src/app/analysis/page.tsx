"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import allQuestionsData from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { getQuizHistory, getAttempts } from "@/lib/storage";
import { TOPIC_LABELS } from "@/lib/topics";
import TopicBadge from "@/components/TopicBadge";

interface TopicAnalysis {
  key: string;
  label: string;
  totalQuestions: number;
  totalScore: number;
  totalPossible: number;
  attempts: number;
  avgPct: number;
}

interface QuestionStats {
  id: number;
  question: string;
  topic: string;
  correct: number;
  incorrect: number;
  total: number;
  pct: number;
}

function TrendChart({ history }: { history: { pct: number; date: string }[] }) {
  const w = 320;
  const h = 100;
  const pad = { top: 5, right: 5, bottom: 20, left: 5 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;

  if (history.length < 2) return null;

  const minPct = Math.min(...history.map((d) => d.pct));
  const maxPct = Math.max(...history.map((d) => d.pct));
  const range = Math.max(maxPct - minPct, 20);
  const bottom = Math.max(0, minPct - range * 0.1);

  const xScale = (i: number) => pad.left + (i / (history.length - 1)) * iw;
  const yScale = (v: number) => pad.top + ih - ((v - bottom) / (range * 1.2)) * ih;

  const points = history.map((d, i) => `${xScale(i)},${yScale(d.pct)}`).join(" ");

  const last = history[history.length - 1];
  const first = history[0];
  const trend = last.pct - first.pct;

  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold" style={{ color: "var(--color-ink)", fontWeight: 600, lineHeight: 1.21 }}>Score Trend</h3>
        <span className="text-sm font-bold" style={{ color: trend >= 0 ? "var(--color-brand-green)" : "var(--color-incorrect)" }}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm mx-auto">
        <polyline fill="none" stroke="var(--color-brand-green)" strokeWidth="2" points={points} />
        {history.map((d, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(d.pct)} r="3" fill={d.pct >= 80 ? "var(--color-brand-green)" : d.pct >= 60 ? "var(--color-accent-blue)" : "#d29922"} />
        ))}
        {[0, history.length - 1].map((i) => (
          <g key={i}>
            <text x={xScale(i)} y={h - 3} textAnchor={i === 0 ? "start" : "end"} style={{ fontSize: "8px", fill: "var(--color-muted)" }}>
              {new Date(history[i].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </text>
            <text x={xScale(i)} y={yScale(history[i].pct) - 6} textAnchor={i === 0 ? "start" : "end"} style={{ fontSize: "9px", fontWeight: "bold", fill: "var(--color-ink)" }}>
              {history[i].pct}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [topicAnalysis, setTopicAnalysis] = useState<TopicAnalysis[]>([]);
  const [questionStats, setQuestionStats] = useState<QuestionStats[]>([]);

  useEffect(() => {
    const qs = allQuestionsData as Question[];

    const topicsTotal: Record<string, number> = {};
    for (const q of qs) topicsTotal[q.topic] = (topicsTotal[q.topic] || 0) + 1;

    const history = getQuizHistory();
    const attempts = getAttempts();

    const grouped: Record<string, { score: number; total: number; count: number }> = {};
    for (const r of history) {
      const key = r.topic || "all";
      if (!grouped[key]) grouped[key] = { score: 0, total: 0, count: 0 };
      grouped[key].score += r.score;
      grouped[key].total += r.total;
      grouped[key].count += 1;
    }

    const tResult: TopicAnalysis[] = Object.entries(grouped)
      .filter(([k]) => k !== "all")
      .map(([key, g]) => ({
        key,
        label: TOPIC_LABELS[key] || key,
        totalQuestions: topicsTotal[key] ?? 0,
        totalScore: g.score,
        totalPossible: g.total,
        attempts: g.count,
        avgPct: g.total > 0 ? Math.round((g.score / g.total) * 100) : 0,
      }))
      .sort((a, b) => a.avgPct - b.avgPct);

    setTopicAnalysis(tResult);

    const attemptIds = Object.keys(attempts).map(Number);
    if (attemptIds.length > 0) {
      const qMap = new Map(qs.map((q) => [q.id, q]));
      const qStats: QuestionStats[] = attemptIds
        .map((id) => {
          const a = attempts[id];
          const q = qMap.get(id);
          const total = a.correct + a.incorrect;
          return {
            id,
            question: q?.question ?? `Question #${id}`,
            topic: q?.topic ?? "unknown",
            correct: a.correct,
            incorrect: a.incorrect,
            total,
            pct: total > 0 ? Math.round((a.correct / total) * 100) : 0,
          };
        })
        .filter((q) => q.total > 0)
        .sort((a, b) => a.pct - b.pct);
      setQuestionStats(qStats);
    }

    setLoading(false);
  }, []);

  const history = getQuizHistory();
  const trendData = useMemo(
    () => [...history].reverse().map((r) => ({
      pct: Math.round((r.score / r.total) * 100),
      date: r.date,
    })),
    [history],
  );

  const weakCount = topicAnalysis.filter((a) => a.avgPct < 60).length;
  const hardQuestions = questionStats.filter((q) => q.pct < 60 && q.total >= 1);
  const hasTopicData = topicAnalysis.length > 0;
  const hasAttemptData = questionStats.length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }} className="inline-block mb-4">
          ← Home
        </Link>

        <h1 className="text-2xl font-bold mb-2" style={{ fontWeight: 700, lineHeight: 1.19 }}>📈 Analysis</h1>
        <p className="mb-6" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }}>
          Performance trends, topic breakdown, and specific questions to study.
        </p>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-hairline)", borderTopColor: "var(--color-brand-green)" }} />
          </div>
        )}

        {!loading && !hasTopicData && !hasAttemptData && (
          <div className="text-center py-12">
            <p className="mb-2" style={{ color: "var(--color-steel)", fontSize: "1.125rem" }}>No quiz data yet</p>
            <p className="mb-4" style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>Complete a quiz to start tracking your progress.</p>
            <Link href="/" className="btn-primary">Take a Quiz</Link>
          </div>
        )}

        {!loading && (
          <>
            {trendData.length >= 2 && <TrendChart history={trendData} />}

            {hardQuestions.length > 0 && (
              <div className="mb-6">
                <div className="p-4 mb-4 text-sm" style={{ borderRadius: "var(--rounded-md)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-hairline)", color: "var(--color-slate)" }}>
                  ⚠ <strong>{hardQuestions.length} question{hardQuestions.length > 1 ? "s" : ""}</strong> need study — accuracy below 60%.
                  Review these in <Link href="/review" className="underline" style={{ color: "var(--color-brand-green-dark)" }}>Review Mistakes</Link> or <Link href="/study" className="underline" style={{ color: "var(--color-brand-green-dark)" }}>Study Mode</Link>.
                </div>

                <h2 className="text-lg font-semibold mb-4" style={{ fontWeight: 600, lineHeight: 1.21 }}>📚 Questions to Study</h2>
                <div className="space-y-3">
                  {hardQuestions.map((q) => (
                    <div key={q.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-ink)", fontWeight: 600 }}>{q.question}</p>
                          <TopicBadge topic={q.topic} />
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold" style={{ color: q.pct < 40 ? "var(--color-incorrect)" : "#d29922" }}>{q.pct}%</p>
                          <p className="text-xs" style={{ color: "var(--color-stone)" }}>{q.correct}/{q.total}</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 mt-2 overflow-hidden progress-track" style={{ borderRadius: "9999px" }}>
                        <div className="h-full" style={{ width: `${q.pct}%`, backgroundColor: q.pct < 40 ? "var(--color-incorrect)" : "#d29922", borderRadius: "9999px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasTopicData && (
              <>
                {weakCount > 0 && (
                  <div className="p-4 mb-4 text-sm" style={{ borderRadius: "var(--rounded-md)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-hairline)", color: "var(--color-slate)" }}>
                    ⚠ Focus on <strong>{weakCount} topic{weakCount > 1 ? "s" : ""}</strong> with scores below 60%.
                  </div>
                )}

                <h2 className="text-lg font-semibold mb-4" style={{ fontWeight: 600, lineHeight: 1.21 }}>By Topic</h2>
                <div className="space-y-4">
                  {topicAnalysis.map((a) => {
                    const barColor = a.avgPct >= 80 ? "var(--color-brand-green)" : a.avgPct >= 60 ? "var(--color-accent-blue)" : "#d29922";
                    return (
                      <div key={a.key} className="card p-5">
                        <div className="flex items-center justify-between mb-3">
                          <TopicBadge topic={a.key} />
                          <span className="text-lg font-bold" style={{ color: barColor }}>{a.avgPct}%</span>
                        </div>
                        <div className="w-full h-2 mb-3 overflow-hidden progress-track" style={{ borderRadius: "9999px" }}>
                          <div className="h-full" style={{ width: `${a.avgPct}%`, backgroundColor: barColor, borderRadius: "9999px" }} />
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center text-xs">
                          <div>
                            <p className="font-semibold" style={{ color: "var(--color-ink)" }}>{a.totalScore}/{a.totalPossible}</p>
                            <p style={{ color: "var(--color-steel)" }}>Correct</p>
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: "var(--color-ink)" }}>{a.attempts}</p>
                            <p style={{ color: "var(--color-steel)" }}>Quizzes</p>
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: "var(--color-ink)" }}>{a.totalQuestions}</p>
                            <p style={{ color: "var(--color-steel)" }}>Questions</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {(hasTopicData || hasAttemptData) && (
              <div className="mt-8 card p-5">
                <h3 className="font-semibold mb-2" style={{ color: "var(--color-ink)", fontWeight: 600, lineHeight: 1.21 }}>💡 Tips</h3>
                <ul className="text-sm space-y-1.5" style={{ color: "var(--color-slate)" }}>
                  <li>• <strong style={{ color: "var(--color-brand-green)" }}>Green</strong> (≥80%): You&apos;re doing well — maintain with occasional practice.</li>
                  <li>• <strong style={{ color: "var(--color-accent-blue)" }}>Blue</strong> (60–79%): Decent but room for improvement — review weak areas.</li>
                  <li>• <strong style={{ color: "#d29922" }}>Yellow</strong> (&lt;60%): Needs focus — spend extra time on these topics.</li>
                  <li>• Questions at the top of the &ldquo;Questions to Study&rdquo; list are your weakest — start there.</li>
                  <li>• Use <Link href="/study" className="underline" style={{ color: "var(--color-brand-green-dark)" }}>Study Mode</Link> to browse answers or <Link href="/review" className="underline" style={{ color: "var(--color-brand-green-dark)" }}>Review Mistakes</Link> to retry.</li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

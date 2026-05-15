"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { saveQuizRecord, addMissedQuestions, recordAttempt } from "@/lib/storage";
import { shuffleArray, dateSeed } from "@/lib/random";
import { TOPIC_LABELS } from "@/lib/topics";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import { CardSkeleton } from "@/components/Skeleton";

function shuffleOptions(q: Question): Question {
  const paired = q.options.map((opt, i) => ({ opt, i }));
  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }
  return {
    ...q,
    options: paired.map(p => p.opt),
    correctAnswer: paired.findIndex(p => p.i === q.correctAnswer),
  };
}

function QuizContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "";
  const count = parseInt(searchParams.get("count") || "10");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"quiz" | "review">("quiz");
  const daily = searchParams.get("daily") === "true";

  const qs = allQuestions as Question[];

  useEffect(() => {
    setLoading(true);
    setError(null);
    const all = topic ? qs.filter((q) => q.topic === topic) : qs;
    const shuffled = daily ? shuffleArray(all, dateSeed()) : shuffleArray(all, Date.now());
    const selected = shuffled.slice(0, Math.min(count, shuffled.length)).map(shuffleOptions);
    setQuestions(selected);
    setLoading(false);
  }, [topic, count, daily]);

  const handleSelect = (optionIndex: number) => {
    if (!questions[currentIndex]) return;
    setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: optionIndex }));
  };

  const finishQuiz = () => {
    const score = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const missed = questions.filter((q) => answers[q.id] !== q.correctAnswer).map((q) => q.id);
    addMissedQuestions(missed);
    questions.forEach((q) => recordAttempt(q.id, answers[q.id] === q.correctAnswer));
    saveQuizRecord({
      date: new Date().toISOString(),
      score,
      total: questions.length,
      topic: topic || undefined,
    });
    setPhase("review");
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  useEffect(() => {
    if (phase !== "quiz") return;
    const q = questions[currentIndex];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (q && idx < q.options.length) handleSelect(idx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, currentIndex, questions]);

  const current = questions[currentIndex];
  const answered = Object.keys(answers).length;
  const selected = current ? (answers[current.id] ?? null) : null;
  const allAnswered = answered === questions.length && questions.length > 0;

  const score = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correctAnswer).length,
    [questions, answers]
  );
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const topicLabel = topic ? ` · ${TOPIC_LABELS[topic]}` : "";

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="h-4 w-16 mb-6" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-md)" }} />
          <div className="h-3 w-32 mb-6" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-md)" }} />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ backgroundColor: "var(--color-canvas)" }}>
        <p style={{ color: "var(--color-slate)", fontSize: "1.125rem" }}>{error || "No questions found"}</p>
        <Link href="/" style={{ color: "var(--color-brand-green-dark)" }} className="hover:underline">Back home</Link>
      </div>
    );
  }

  if (phase === "review") {
    const msg = pct >= 80 ? "Excellent!" : pct >= 60 ? "Good effort!" : "Keep practicing!";
    const emoji = pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪";
    const barColor = pct >= 80 ? "var(--color-brand-green)" : pct >= 60 ? "var(--color-accent-blue)" : "#d29922";
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="card p-8 text-center mb-8" style={{ marginTop: "-0.5rem" }}>
            <p className="text-6xl mb-4">{emoji}</p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: barColor }}>{msg}</h1>
            <p className="mt-2 mb-4" style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>
              {TOPIC_LABELS[topic]} · {questions.length} questions
            </p>
            <div className="flex items-center justify-center gap-1 my-4">
              <span className="text-5xl font-bold" style={{ color: "var(--color-ink)" }}>{score}</span>
              <span className="text-2xl" style={{ color: "var(--color-muted)" }}>/</span>
              <span className="text-3xl" style={{ color: "var(--color-muted)" }}>{questions.length}</span>
            </div>
            <div className="w-full h-2 mb-2 max-w-xs mx-auto overflow-hidden progress-track" style={{ borderRadius: "9999px" }}>
              <div className="h-full" style={{ width: `${pct}%`, backgroundColor: barColor, borderRadius: "9999px" }} />
            </div>
            <p className="text-2xl font-bold mb-6" style={{ color: "var(--color-ink)" }}>{pct}%</p>
            <div className="flex gap-3 justify-center">
              <Link href="/" className="btn-primary">New Quiz</Link>
              <Link href="/results" className="btn-secondary">History</Link>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4" style={{ fontWeight: 600, lineHeight: 1.21 }}>Review Answers</h2>
          <div className="space-y-6">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} selected={answers[q.id] ?? null} onSelect={() => {}} mode="review" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" style={{ color: "var(--color-steel)", fontSize: "0.875rem" }}>
            ← Quit
          </Link>
          <span className="micro-uppercase">{topicLabel} · {answered}/{questions.length}</span>
        </div>

        <ProgressBar current={currentIndex} total={questions.length} answered={answered} />

        <div className="mt-6">
          <QuestionCard question={current} selected={selected} onSelect={handleSelect} mode="quiz" />
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.875rem" }}
          >
            ← Previous
          </button>
          {currentIndex < questions.length - 1 ? (
            <button onClick={goNext} className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>
              Next →
            </button>
          ) : (
            <button
              onClick={finishQuiz}
              disabled={!allAnswered}
              className="btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.875rem", opacity: allAnswered ? 1 : 0.4, cursor: allAnswered ? "pointer" : "not-allowed" }}
            >
              {allAnswered ? "Finish Quiz" : `Answer all (${questions.length - answered} left)`}
            </button>
          )}
        </div>

        <div className="flex justify-center mt-4 gap-1.5">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{
                backgroundColor: i === currentIndex
                  ? "var(--color-accent-blue)"
                  : answers[q.id] !== undefined
                  ? "var(--color-brand-green)"
                  : "var(--color-hairline)",
                transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-canvas)" }}><p style={{ color: "var(--color-steel)" }}>Loading...</p></div>}>
      <QuizContent />
    </Suspense>
  );
}

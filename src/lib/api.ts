import questions from "./questions.json";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

const qs = questions as Question[];

export async function fetchQuestions(topic?: string): Promise<Question[]> {
  if (topic) return qs.filter((q) => q.topic === topic);
  return qs;
}

export async function fetchQuestion(id: number): Promise<Question | undefined> {
  return qs.find((q) => q.id === id);
}

export async function fetchRandom(count: number = 10): Promise<Question[]> {
  return [...qs].sort(() => Math.random() - 0.5).slice(0, count);
}

export async function fetchTopics(): Promise<Record<string, { count: number; label: string }>> {
  const map: Record<string, number> = {};
  for (const q of qs) {
    map[q.topic] = (map[q.topic] || 0) + 1;
  }
  const result: Record<string, { count: number; label: string }> = {};
  for (const [key, count] of Object.entries(map)) {
    result[key] = { count, label: key };
  }
  return result;
}

export async function fetchStats(): Promise<{ total: number; topics: Record<string, number> }> {
  const topics: Record<string, number> = {};
  for (const q of qs) {
    topics[q.topic] = (topics[q.topic] || 0) + 1;
  }
  return { total: qs.length, topics };
}

export async function fetchQuestionsByIds(ids: number[]): Promise<Question[]> {
  const idSet = new Set(ids);
  return qs.filter((q) => idSet.has(q.id));
}

export async function searchQuestions(q: string): Promise<Question[]> {
  const lower = q.toLowerCase();
  return qs.filter(
    (q) =>
      q.question.toLowerCase().includes(lower) ||
      q.explanation.toLowerCase().includes(lower),
  );
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export interface QuizRecord {
  date: string;
  score: number;
  total: number;
  topic?: string;
}
export type CareerDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Career {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: CareerDifficulty;
  icon: string;
}

export interface TrialStep {
  day: number;
  title: string;
  type: "lesson" | "task" | "game" | "quiz" | "project";
  content: string;
  gameKey?: string;
  options?: string[];
  answer?: string;
}

export interface Trial {
  _id: string;
  careerId: string;
  tasks: TrialStep[];
}

export interface TrialProgress {
  currentDay: number;
  completedDays: number[];
  taskScore: number;
  quizScore: number;
  gameScore: number;
  status: "in_progress" | "completed";
}

export interface CompatibilityResult {
  id?: string;
  careerId: string;
  careerTitle?: string;
  score: number;
  strengths: string[];
  weakness: string[];
  breakdown: {
    taskScore: number;
    quizScore: number;
    gameScore: number;
  };
  suggestedCareers: string[];
  createdAt?: string;
}

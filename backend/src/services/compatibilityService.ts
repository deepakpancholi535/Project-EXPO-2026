type ScorePayload = {
  careerTitle: string;
  taskScore: number;
  quizScore: number;
  gameScore: number;
};

type CompatibilityResult = {
  score: number;
  strengths: string[];
  weakness: string[];
  suggestedCareers: string[];
};

const careerSuggestions: Record<string, string[]> = {
  "Software Engineer": ["Data Analyst", "UI/UX Designer"],
  "Data Analyst": ["Software Engineer", "UI/UX Designer"],
  "UI/UX Designer": ["Data Analyst", "Software Engineer"]
};

const normalize = (value: number): number => {
  return Math.max(0, Math.min(100, Math.round(value)));
};

export const calculateCompatibility = ({
  careerTitle,
  taskScore,
  quizScore,
  gameScore
}: ScorePayload): CompatibilityResult => {
  const normalizedTask = normalize(taskScore);
  const normalizedQuiz = normalize(quizScore);
  const normalizedGame = normalize(gameScore);

  const score = normalize(
    normalizedTask * 0.35 + normalizedQuiz * 0.25 + normalizedGame * 0.4
  );

  const strengths: string[] = [];
  const weakness: string[] = [];

  if (normalizedTask >= 70) strengths.push("Task execution");
  else weakness.push("Practical task consistency");

  if (normalizedQuiz >= 70) strengths.push("Core concept clarity");
  else weakness.push("Fundamental concept retention");

  if (normalizedGame >= 70) strengths.push("Interactive problem solving");
  else weakness.push("Scenario-based decision speed");

  if (careerTitle === "Software Engineer") {
    if (normalizedGame >= 75) strengths.push("Logical thinking");
    if (normalizedTask >= 75) strengths.push("Problem solving");
    if (normalizedQuiz < 60) weakness.push("Algorithm knowledge");
  }

  if (careerTitle === "Data Analyst") {
    if (normalizedQuiz >= 75) strengths.push("Analytical reasoning");
    if (normalizedGame >= 70) strengths.push("Pattern recognition");
    if (normalizedTask < 60) weakness.push("Data storytelling structure");
  }

  if (careerTitle === "UI/UX Designer") {
    if (normalizedGame >= 75) strengths.push("Visual judgment");
    if (normalizedTask >= 70) strengths.push("User empathy");
    if (normalizedQuiz < 60) weakness.push("Design system principles");
  }

  return {
    score,
    strengths: Array.from(new Set(strengths)).slice(0, 4),
    weakness: Array.from(new Set(weakness)).slice(0, 4),
    suggestedCareers: careerSuggestions[careerTitle] ?? []
  };
};

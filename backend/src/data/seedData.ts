import { CareerDifficulty } from "../models/Career";
import { ITrialStep } from "../models/Trial";

interface CareerSeed {
  title: string;
  slug: string;
  description: string;
  difficulty: CareerDifficulty;
  icon: string;
}

export const careerSeeds: CareerSeed[] = [
  {
    title: "Software Engineer",
    slug: "software-engineer",
    description:
      "Build and debug software systems through logic, code structure, and iterative problem solving.",
    difficulty: "Intermediate",
    icon: "Code2"
  },
  {
    title: "Data Analyst",
    slug: "data-analyst",
    description:
      "Transform raw data into decisions by recognizing patterns, selecting charts, and forming insights.",
    difficulty: "Beginner",
    icon: "LineChart"
  },
  {
    title: "UI/UX Designer",
    slug: "ui-ux-designer",
    description:
      "Design intuitive digital experiences by balancing visual harmony, usability, and information flow.",
    difficulty: "Beginner",
    icon: "Palette"
  }
];

export const trialSeedsBySlug: Record<string, ITrialStep[]> = {
  "software-engineer": [
    {
      day: 1,
      title: "Introduction Lesson",
      type: "lesson",
      content:
        "Learn core software engineering workflows: understanding requirements, debugging, testing, and shipping confidently."
    },
    {
      day: 2,
      title: "Small Task: Refactor a Function",
      type: "task",
      content:
        "Review a long function and pick the best refactor approach: split helpers, remove duplication, and rename variables clearly."
    },
    {
      day: 3,
      title: "Interactive Mini-Game",
      type: "game",
      gameKey: "bug-fix-game",
      content:
        "Debug a broken snippet and then solve a quick output prediction puzzle."
    },
    {
      day: 4,
      title: "Quiz",
      type: "quiz",
      content: "Which concept helps prevent regressions when refactoring code?",
      options: ["Version control commits", "Unit tests", "Long variable names"],
      answer: "Unit tests"
    },
    {
      day: 5,
      title: "Mini Project",
      type: "project",
      content:
        "Plan a feature rollout for a student app: define API, UI flow, test cases, and one performance optimization."
    }
  ],
  "data-analyst": [
    {
      day: 1,
      title: "Introduction Lesson",
      type: "lesson",
      content:
        "Understand the analytics lifecycle: define a question, clean data, visualize trends, and communicate findings."
    },
    {
      day: 2,
      title: "Small Task: KPI Snapshot",
      type: "task",
      content:
        "Choose the most relevant metric to track weekly engagement for a learning app."
    },
    {
      day: 3,
      title: "Interactive Mini-Game",
      type: "game",
      gameKey: "pattern-recognition-game",
      content:
        "Spot trend changes in sample data and select the best chart for each scenario."
    },
    {
      day: 4,
      title: "Quiz",
      type: "quiz",
      content:
        "Which chart is best for showing change in values over time (monthly data)?",
      options: ["Pie chart", "Line chart", "Treemap"],
      answer: "Line chart"
    },
    {
      day: 5,
      title: "Mini Project",
      type: "project",
      content:
        "Build an insights brief from a dataset: include chart choice, trend summary, and one recommendation."
    }
  ],
  "ui-ux-designer": [
    {
      day: 1,
      title: "Introduction Lesson",
      type: "lesson",
      content:
        "Explore UX thinking: user goals, interface hierarchy, accessibility, and visual consistency."
    },
    {
      day: 2,
      title: "Small Task: Heuristic Review",
      type: "task",
      content:
        "Identify two usability issues in a checkout screen and recommend concise design improvements."
    },
    {
      day: 3,
      title: "Interactive Mini-Game",
      type: "game",
      gameKey: "color-palette-game",
      content:
        "Choose accessible palettes and arrange UI blocks for a clear visual flow."
    },
    {
      day: 4,
      title: "Quiz",
      type: "quiz",
      content:
        "What should a primary CTA button optimize for most in most consumer flows?",
      options: ["Visual noise", "Clarity and hierarchy", "Tiny text size"],
      answer: "Clarity and hierarchy"
    },
    {
      day: 5,
      title: "Mini Project",
      type: "project",
      content:
        "Design a high-fidelity landing section with typography scale, color system, and mobile adaptation notes."
    }
  ]
};

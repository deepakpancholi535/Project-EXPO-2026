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
      title: "Module 1: The Modern Data Ecosystem",
      type: "lesson",
      content:
        "Concept: Understand how brands like Netflix and Swiggy use data to drive profit, and what a modern analyst does day to day.\nTAC Gig: \"The Brand Audit.\" Identify 3 specific data points a company collects about you and hypothesize how they use each one to increase revenue.",
      resources: [
        {
          label: "What Does a Data Analyst Actually Do? (2025 Update)",
          url: "https://www.youtube.com/watch?v=mCSbYbXWmH0"
        }
      ]
    },
    {
      day: 2,
      title: "Module 2: Cleaning the Chaos (Excel & Google Sheets)",
      type: "task",
      content:
        "Concept: Learn to scrub messy data. Cleaning is often 80% of analyst work, and wrong data leads to wrong decisions.\nTAC Gig: \"The Messy Menu.\" Use a Pivot Table on a dataset to identify the top 3 failing products for a restaurant.",
      resources: [
        {
          label: "Clean Your Excel Data Like a PRO",
          url: "https://www.youtube.com/watch?v=K89RlG2NxzU"
        },
        {
          label: "Data Analysis in Excel (No Python Required)",
          url: "https://www.youtube.com/watch?v=wSFWJ0AF7SM"
        }
      ]
    },
    {
      day: 3,
      title: "Module 3: Talking to Databases (SQL Basics)",
      type: "game",
      gameKey: "pattern-recognition-game",
      content:
        "Concept: Move beyond spreadsheets and query large datasets using SQL.\nTAC Gig: \"The Warehouse Hunt.\" Write a basic SQL query to find customers who have not made a purchase in the last 6 months.\nFinish both mini-games below and save your combined score.",
      resources: [
        {
          label: "SQL Explained in 6 Minutes",
          url: "https://www.google.com/search?q=https://www.youtube.com/watch%3Fv%3D27aksOhn8IE"
        },
        {
          label: "Full SQL Course for Beginners (2026 Edition)",
          url: "https://www.youtube.com/watch?v=aS4XhMIT21s"
        }
      ]
    },
    {
      day: 4,
      title: "Module 4: Visual Storytelling (Power BI / Tableau)",
      type: "quiz",
      content:
        "Concept: Transform rows into executive dashboards that tell a clear business story.\nKnowledge Check: Which chart is best for showing change in values over time (monthly data)?",
      resources: [
        {
          label: "Beginner-Friendly Guide to Better Charts",
          url: "https://www.youtube.com/watch?v=UjXFRk_HICU"
        },
        {
          label: "2025 Power BI Dashboard: Beginner to Pro",
          url: "https://www.youtube.com/watch?v=2M-5fiMu5Dw"
        }
      ],
      options: ["Pie chart", "Line chart", "Treemap"],
      answer: "Line chart"
    },
    {
      day: 5,
      title: "Module 5 + Final Project: Insights and Communication",
      type: "project",
      content:
        "Concept: An analyst's value is in recommendations. Present findings clearly to non-technical stakeholders.\nTAC Gig: \"The Boardroom Simulation.\" Record a 60-second insight brief explaining one key discovery from your dashboard.\nFinal Project: The E-Commerce Recovery Mission. Diagnose why an online store is losing money and recommend fixes using cleaned data, SQL queries, and visual evidence.",
      resources: [
        {
          label: "Storytelling with Data (Crash Course)",
          url: "https://www.youtube.com/watch?v=ptsmJveoH2g"
        },
        {
          label: "How to Present Data Insights to Stakeholders",
          url: "https://www.youtube.com/watch?v=8EMW7io4rSI"
        },
        {
          label: "End-to-End Data Analysis Project (SQL & Power BI)",
          url: "https://www.youtube.com/watch?v=jdGJWloo-OU"
        }
      ]
    }
  ],
  "ui-ux-designer": [
    {
      day: 1,
      title: "Module 1: Introduction to UI/UX",
      type: "lesson",
      content:
        "Concepts: Understand UI and UX, core designer roles, and the full design process overview.\nOutcome: Build clarity on what UI/UX designers actually do in real product teams.",
      resources: [
        {
          label: "Introduction to UI/UX Design (10-min)",
          url: "https://www.youtube.com/watch?v=p0Pw_aI5rY0"
        }
      ]
    },
    {
      day: 2,
      title: "Module 2: UI Basics + First Layout",
      type: "task",
      content:
        "Concepts: Learn layout, buttons, typography, and color for interface fundamentals.\nTask: Use Figma to design a coffee shop landing page frame.",
      resources: [
        {
          label: "Figma Design Basics for Beginners (13-min)",
          url: "https://www.youtube.com/watch?v=jQ1sfKIl50E"
        },
        {
          label: "Creating Responsive Buttons and Components",
          url: "https://www.youtube.com/watch?v=PZaBmmI0s4M"
        }
      ]
    },
    {
      day: 3,
      title: "Module 3: Interface Analysis",
      type: "game",
      gameKey: "color-palette-game",
      content:
        "Concepts: Analyze popular apps and websites to identify strong and weak design patterns.\nTask: Write design observations on popular digital products.\nFinish both mini-games below and save your combined score.",
      resources: [
        {
          label: "Good Design vs. Bad Design Examples",
          url: "https://www.youtube.com/watch?v=-3keSvD2soI"
        },
        {
          label: "4 Levels of UI/UX Design and Mistakes to Avoid",
          url: "https://www.youtube.com/watch?v=86PGRyQjdzQ"
        }
      ]
    },
    {
      day: 4,
      title: "Module 4: Real Scenario Design",
      type: "quiz",
      content:
        "Concepts: Design onboarding screens for a startup and define an effective layout flow.\nKnowledge Check: Which design choice matters most when optimizing onboarding conversion?",
      resources: [
        {
          label: "Importance of Onboarding Screens",
          url: "https://www.youtube.com/watch?v=eEMyZfeBAQQ"
        },
        {
          label: "Designing Onboarding in Figma Step-by-Step",
          url: "https://www.youtube.com/watch?v=zucDqXtTaJA"
        }
      ],
      options: [
        "Use as many CTA buttons as possible",
        "Clear hierarchy with one focused primary CTA",
        "Hide progress and instructions"
      ],
      answer: "Clear hierarchy with one focused primary CTA"
    },
    {
      day: 5,
      title: "Module 5 + Final Project: Decision Simulation",
      type: "project",
      content:
        "Concepts: Choose the best design options based on user behavior and product goals.\nFinal Project: Food Delivery App. Design 4 screens: Home, Menu, Checkout, and Tracking.\nFocus: Apply all learned concepts to a full real-world user journey.",
      resources: [
        {
          label: "How to Really Make Design Decisions",
          url: "https://www.youtube.com/watch?v=O_TDCiHNJ6I"
        },
        {
          label: "Modern Food Delivery App Full Flow (Figma)",
          url: "https://www.youtube.com/watch?v=nh4E48zsfE8"
        }
      ]
    }
  ]
};

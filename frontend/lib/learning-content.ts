export type ProgramTrack = "programming" | "web-development" | "data-structures";

export type LeaderboardTrack = ProgramTrack | "overall";

export type GameDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type GameComponentKey =
  | "bug-fix-game"
  | "logic-puzzle-game"
  | "pattern-recognition-game"
  | "chart-selection-game"
  | "color-palette-game"
  | "layout-challenge-game";

export interface LearningGame {
  id: string;
  title: string;
  description: string;
  difficulty: GameDifficulty;
  program: ProgramTrack;
  componentKey: GameComponentKey;
  estimatedMinutes: number;
}

export interface VideoLecture {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
}

export interface ModuleAssignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  videoLectures: VideoLecture[];
  assignment: ModuleAssignment;
}

export interface LearningCourse {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  program: ProgramTrack;
  modules: CourseModule[];
}

export interface LeaderboardSeedProfile {
  id: string;
  fullName: string;
  initials: string;
  profileLink: string;
  programEnrolled: string;
  pointsByProgram: Record<ProgramTrack, number>;
}

export const programLabels: Record<ProgramTrack, string> = {
  programming: "Programming",
  "web-development": "Web Development",
  "data-structures": "Data Structures"
};

export const leaderboardLabels: Record<LeaderboardTrack, string> = {
  programming: "Programming Leaderboard",
  "web-development": "Web Development Leaderboard",
  "data-structures": "Data Structures Leaderboard",
  overall: "Overall Leaderboard"
};

export const learningGames: LearningGame[] = [
  {
    id: "bug-fix",
    title: "Bug Fix Sprint",
    description:
      "Analyze a broken snippet and pick the safest production-ready fix.",
    difficulty: "Intermediate",
    program: "programming",
    componentKey: "bug-fix-game",
    estimatedMinutes: 5
  },
  {
    id: "logic-puzzle",
    title: "Logic Puzzle Dash",
    description:
      "Test computational reasoning by predicting output and control flow.",
    difficulty: "Intermediate",
    program: "programming",
    componentKey: "logic-puzzle-game",
    estimatedMinutes: 4
  },
  {
    id: "pattern-recognition",
    title: "Pattern Recognition Lab",
    description:
      "Spot data trends and generate the most likely practical conclusion.",
    difficulty: "Beginner",
    program: "data-structures",
    componentKey: "pattern-recognition-game",
    estimatedMinutes: 4
  },
  {
    id: "chart-selection",
    title: "Chart Selection Arena",
    description:
      "Choose accurate visualizations for common analytics scenarios.",
    difficulty: "Beginner",
    program: "data-structures",
    componentKey: "chart-selection-game",
    estimatedMinutes: 4
  },
  {
    id: "color-palette",
    title: "Color Accessibility Quest",
    description:
      "Select accessible color systems with clear contrast and hierarchy.",
    difficulty: "Beginner",
    program: "web-development",
    componentKey: "color-palette-game",
    estimatedMinutes: 3
  },
  {
    id: "layout-challenge",
    title: "Layout Flow Challenge",
    description:
      "Arrange UI blocks to create a logical and high-converting page flow.",
    difficulty: "Intermediate",
    program: "web-development",
    componentKey: "layout-challenge-game",
    estimatedMinutes: 6
  }
];

export const learningCourses: LearningCourse[] = [
  {
    id: "programming-foundations",
    slug: "programming-foundations",
    title: "Programming Foundations",
    instructor: "Ananya Rao",
    description:
      "Build confidence with core programming concepts, debugging patterns, and clean implementation flow.",
    level: "Beginner",
    program: "programming",
    modules: [
      {
        id: "pf-module-1",
        title: "Programming Mindset & Syntax",
        description:
          "Understand control flow, variables, and practical thinking patterns for coding interviews and projects.",
        videoLectures: [
          {
            id: "pf-m1-l1",
            title: "How Computers Execute Code",
            description:
              "A fast visual walkthrough of statements, memory, and execution order.",
            duration: "09:20",
            videoUrl: "https://www.youtube.com/embed/zOjov-2OZ0E"
          },
          {
            id: "pf-m1-l2",
            title: "Conditionals and Loops in Practice",
            description:
              "Use if/else and loops to solve real student-level coding tasks.",
            duration: "11:15",
            videoUrl: "https://www.youtube.com/embed/eSYeHlwDCNA"
          }
        ],
        assignment: {
          id: "pf-m1-a1",
          title: "Control Flow Workbook",
          description:
            "Upload your solved worksheet with three loop and branching exercises.",
          deadline: "2026-04-10"
        }
      },
      {
        id: "pf-module-2",
        title: "Functions, Debugging, and Quality",
        description:
          "Move from basic syntax to writing reusable functions and identifying common logic errors.",
        videoLectures: [
          {
            id: "pf-m2-l1",
            title: "Function Design for Reusability",
            description:
              "Break tasks into small composable functions and avoid duplication.",
            duration: "10:42",
            videoUrl: "https://www.youtube.com/embed/NE97ylAnrz4"
          },
          {
            id: "pf-m2-l2",
            title: "Debugging Strategy for Beginners",
            description:
              "A repeatable process for reproducing, isolating, and fixing bugs.",
            duration: "08:50",
            videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8"
          }
        ],
        assignment: {
          id: "pf-m2-a1",
          title: "Mini Debug Challenge",
          description:
            "Submit fixes for two intentionally buggy snippets and explain your reasoning.",
          deadline: "2026-04-18"
        }
      }
    ]
  },
  {
    id: "web-development-bootcamp",
    slug: "web-development-bootcamp",
    title: "Modern Web Development Bootcamp",
    instructor: "Ravi Menon",
    description:
      "Learn responsive frontend architecture, component-driven UI, and practical user experience patterns.",
    level: "Intermediate",
    program: "web-development",
    modules: [
      {
        id: "wd-module-1",
        title: "Responsive UI Fundamentals",
        description:
          "Design scalable layouts, spacing systems, and navigation patterns across mobile and desktop.",
        videoLectures: [
          {
            id: "wd-m1-l1",
            title: "Responsive Grids and Breakpoints",
            description:
              "Build adaptive interfaces with predictable layout behavior.",
            duration: "12:05",
            videoUrl: "https://www.youtube.com/embed/S-jQ9J6X8Y4"
          },
          {
            id: "wd-m1-l2",
            title: "Component-Based Styling Systems",
            description:
              "Set up reusable visual language with utility-first classes and tokens.",
            duration: "13:11",
            videoUrl: "https://www.youtube.com/embed/gFzfG9GxV64"
          }
        ],
        assignment: {
          id: "wd-m1-a1",
          title: "Responsive Landing Page",
          description:
            "Upload a screen recording or PDF of your responsive landing page implementation.",
          deadline: "2026-04-15"
        }
      },
      {
        id: "wd-module-2",
        title: "Interaction and UX Polish",
        description:
          "Create smooth interactions, accessible states, and high-confidence navigation design.",
        videoLectures: [
          {
            id: "wd-m2-l1",
            title: "Animation for Better Comprehension",
            description:
              "Use subtle transitions to guide user attention instead of decorative motion.",
            duration: "10:18",
            videoUrl: "https://www.youtube.com/embed/oif9HPow4QY"
          },
          {
            id: "wd-m2-l2",
            title: "Accessible Interaction States",
            description:
              "Implement keyboard focus, hover states, and ARIA hints correctly.",
            duration: "09:37",
            videoUrl: "https://www.youtube.com/embed/8MgpE2DTTKA"
          }
        ],
        assignment: {
          id: "wd-m2-a1",
          title: "UI Micro-Interaction Review",
          description:
            "Submit your UX audit with at least three interaction improvements.",
          deadline: "2026-04-22"
        }
      }
    ]
  },
  {
    id: "data-structures-mastery",
    slug: "data-structures-mastery",
    title: "Data Structures Mastery",
    instructor: "Karthik Iyer",
    description:
      "Master foundational data structures and complexity thinking for interviews and production coding.",
    level: "Intermediate",
    program: "data-structures",
    modules: [
      {
        id: "ds-module-1",
        title: "Arrays, Strings, and Hash Maps",
        description:
          "Model common problems using arrays and hash-based lookups efficiently.",
        videoLectures: [
          {
            id: "ds-m1-l1",
            title: "Array Patterns and Complexity",
            description:
              "Two-pointer and sliding-window patterns for high-frequency questions.",
            duration: "14:08",
            videoUrl: "https://www.youtube.com/embed/8hly31xKli0"
          },
          {
            id: "ds-m1-l2",
            title: "Hashing for Fast Retrieval",
            description:
              "When and how to trade memory for lookup performance.",
            duration: "11:27",
            videoUrl: "https://www.youtube.com/embed/shs0KM3wKv8"
          }
        ],
        assignment: {
          id: "ds-m1-a1",
          title: "Hash Map Problem Set",
          description:
            "Upload your solutions and complexity notes for three hash map exercises.",
          deadline: "2026-04-12"
        }
      },
      {
        id: "ds-module-2",
        title: "Stacks, Queues, and Trees",
        description:
          "Build intuition for traversal, ordering, and call-stack driven approaches.",
        videoLectures: [
          {
            id: "ds-m2-l1",
            title: "Stack and Queue Design Patterns",
            description:
              "Use LIFO and FIFO structures for parsers, scheduling, and traversal.",
            duration: "10:51",
            videoUrl: "https://www.youtube.com/embed/wjI1WNcIntg"
          },
          {
            id: "ds-m2-l2",
            title: "Binary Trees and Traversal Strategy",
            description:
              "Choose the right traversal order for search and transformation tasks.",
            duration: "13:09",
            videoUrl: "https://www.youtube.com/embed/fAAZixBzIAI"
          }
        ],
        assignment: {
          id: "ds-m2-a1",
          title: "Tree Traversal Submission",
          description:
            "Submit code and short explanation for DFS and BFS traversal tasks.",
          deadline: "2026-04-25"
        }
      }
    ]
  }
];

export const leaderboardSeedProfiles: LeaderboardSeedProfile[] = [
  {
    id: "seed-1",
    fullName: "Priya Sharma",
    initials: "PS",
    profileLink: "/profile",
    programEnrolled: "Programming Track",
    pointsByProgram: {
      programming: 1320,
      "web-development": 940,
      "data-structures": 1150
    }
  },
  {
    id: "seed-2",
    fullName: "Arjun Verma",
    initials: "AV",
    profileLink: "/profile",
    programEnrolled: "Web Development Track",
    pointsByProgram: {
      programming: 980,
      "web-development": 1410,
      "data-structures": 870
    }
  },
  {
    id: "seed-3",
    fullName: "Neha Das",
    initials: "ND",
    profileLink: "/profile",
    programEnrolled: "Data Structures Track",
    pointsByProgram: {
      programming: 910,
      "web-development": 860,
      "data-structures": 1460
    }
  },
  {
    id: "seed-4",
    fullName: "Rahul Kapoor",
    initials: "RK",
    profileLink: "/profile",
    programEnrolled: "Programming Track",
    pointsByProgram: {
      programming: 1280,
      "web-development": 890,
      "data-structures": 1080
    }
  },
  {
    id: "seed-5",
    fullName: "Sana Ali",
    initials: "SA",
    profileLink: "/profile",
    programEnrolled: "Web Development Track",
    pointsByProgram: {
      programming: 920,
      "web-development": 1365,
      "data-structures": 910
    }
  },
  {
    id: "seed-6",
    fullName: "Kiran Patel",
    initials: "KP",
    profileLink: "/profile",
    programEnrolled: "Data Structures Track",
    pointsByProgram: {
      programming: 875,
      "web-development": 820,
      "data-structures": 1395
    }
  }
];

export const getCourseById = (courseId: string): LearningCourse | undefined =>
  learningCourses.find((course) => course.id === courseId);

export const getGameById = (gameId: string): LearningGame | undefined =>
  learningGames.find((game) => game.id === gameId);

export const getCourseLectureCount = (course: LearningCourse): number =>
  course.modules.reduce((total, moduleItem) => total + moduleItem.videoLectures.length, 0);

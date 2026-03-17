import {
  leaderboardSeedProfiles,
  learningCourses,
  learningGames,
  type LeaderboardTrack,
  type ProgramTrack
} from "@/lib/learning-content";
import {
  getAssignmentSubmissions,
  getUserCourseProgressMap,
  getUserGameScores
} from "@/lib/learning-store";

interface CurrentUserPayload {
  id: string;
  name: string;
}

export interface LeaderboardRow {
  id: string;
  rank: number;
  name: string;
  initials: string;
  points: number;
  programLabel: string;
  profileLink: string;
  isCurrentUser: boolean;
}

export interface HoverCardProfile {
  fullName: string;
  programEnrolled: string;
  points: number;
  rank: number;
  profileLink: string;
}

export interface LeaderboardTable {
  rows: LeaderboardRow[];
  hoverProfiles: Record<string, HoverCardProfile>;
}

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const computeDynamicPoints = (
  userId: string
): Record<ProgramTrack, number> => {
  const programPoints: Record<ProgramTrack, number> = {
    programming: 0,
    "web-development": 0,
    "data-structures": 0
  };

  const gameScores = getUserGameScores(userId);
  Object.values(gameScores).forEach((gameScore) => {
    const game = learningGames.find((item) => item.id === gameScore.gameId);
    if (!game) return;
    programPoints[game.program] += Math.round(gameScore.bestScore * 1.8);
  });

  const courseProgressMap = getUserCourseProgressMap(userId);
  Object.values(courseProgressMap).forEach((progress) => {
    const course = learningCourses.find((item) => item.id === progress.courseId);
    if (!course) return;
    programPoints[course.program] += Math.round(progress.percentComplete * 2.4);
    if (progress.percentComplete >= 100) {
      programPoints[course.program] += 180;
    }
  });

  const assignmentSubmissions = getAssignmentSubmissions(userId);
  assignmentSubmissions.forEach((submission) => {
    const course = learningCourses.find((item) => item.id === submission.courseId);
    if (!course) return;
    programPoints[course.program] += 40;
  });

  return programPoints;
};

const totalPoints = (pointsByProgram: Record<ProgramTrack, number>): number =>
  pointsByProgram.programming +
  pointsByProgram["web-development"] +
  pointsByProgram["data-structures"];

const getProgramLabel = (programKey: ProgramTrack): string => {
  if (programKey === "programming") return "Programming";
  if (programKey === "web-development") return "Web Development";
  return "Data Structures";
};

const getTrackScore = (
  track: LeaderboardTrack,
  pointsByProgram: Record<ProgramTrack, number>
): number => {
  if (track === "overall") {
    return totalPoints(pointsByProgram);
  }
  return pointsByProgram[track];
};

export const buildLeaderboardTable = (
  track: LeaderboardTrack,
  currentUser?: CurrentUserPayload
): LeaderboardTable => {
  const baseEntries = leaderboardSeedProfiles.map((profile) => ({
    id: profile.id,
    name: profile.fullName,
    initials: profile.initials,
    profileLink: profile.profileLink,
    programEnrolled: profile.programEnrolled,
    isCurrentUser: false,
    pointsByProgram: profile.pointsByProgram
  }));

  const withCurrentUser =
    currentUser &&
    !baseEntries.some((entry) => entry.id === `user-${currentUser.id}`)
      ? [
          ...baseEntries,
          {
            id: `user-${currentUser.id}`,
            name: currentUser.name,
            initials: getInitials(currentUser.name),
            profileLink: "/profile",
            programEnrolled: "Learning Platform Scholar",
            isCurrentUser: true,
            pointsByProgram: computeDynamicPoints(currentUser.id)
          }
        ]
      : baseEntries;

  const sorted = [...withCurrentUser].sort((a, b) => {
    const pointsDiff =
      getTrackScore(track, b.pointsByProgram) - getTrackScore(track, a.pointsByProgram);
    if (pointsDiff !== 0) return pointsDiff;
    return a.name.localeCompare(b.name);
  });

  const rows: LeaderboardRow[] = sorted.map((entry, index) => ({
    id: entry.id,
    rank: index + 1,
    name: entry.name,
    initials: entry.initials,
    points: getTrackScore(track, entry.pointsByProgram),
    programLabel:
      track === "overall" ? entry.programEnrolled : getProgramLabel(track),
    profileLink: entry.profileLink,
    isCurrentUser: entry.isCurrentUser
  }));

  const hoverProfiles = rows.reduce<Record<string, HoverCardProfile>>(
    (accumulator, row) => {
      accumulator[row.id] = {
        fullName: row.name,
        programEnrolled: row.programLabel,
        points: row.points,
        rank: row.rank,
        profileLink: row.profileLink
      };
      return accumulator;
    },
    {}
  );

  return {
    rows,
    hoverProfiles
  };
};


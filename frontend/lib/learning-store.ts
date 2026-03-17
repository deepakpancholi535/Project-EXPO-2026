import { getCourseLectureCount, type LearningCourse } from "@/lib/learning-content";

export interface StoredGameScore {
  gameId: string;
  bestScore: number;
  latestScore: number;
  attempts: number;
  updatedAt: string;
}

export interface CourseProgressRecord {
  courseId: string;
  completedLectures: string[];
  completedModules: string[];
  activeLectureId?: string;
  percentComplete: number;
  updatedAt: string;
  completedAt?: string;
}

export interface AssignmentSubmissionRecord {
  id: string;
  courseId: string;
  moduleId: string;
  assignmentId: string;
  fileName: string;
  fileSize: number;
  submittedAt: string;
  status: "Submitted" | "Pending review";
}

export interface CertificateRecord {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  completionDate: string;
  issuedAt: string;
}

const GAME_PREFIX = "tac.learning.games.v1";
const COURSE_PROGRESS_PREFIX = "tac.learning.course-progress.v1";
const ASSIGNMENT_PREFIX = "tac.learning.assignments.v1";
const CERTIFICATE_PREFIX = "tac.learning.certificates.v1";

const isBrowser = () => typeof window !== "undefined";

const scopedKey = (prefix: string, userId: string) =>
  `${prefix}:${userId || "guest-user"}`;

const readStorage = <T>(key: string, fallbackValue: T): T => {
  if (!isBrowser()) return fallbackValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallbackValue;
    return JSON.parse(raw) as T;
  } catch {
    return fallbackValue;
  }
};

const writeStorage = <T>(key: string, value: T): void => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const generateId = (prefix: string): string => {
  const randomSuffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;
};

const formatIsoDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

export const getUserGameScores = (
  userId: string
): Record<string, StoredGameScore> =>
  readStorage<Record<string, StoredGameScore>>(scopedKey(GAME_PREFIX, userId), {});

export const saveUserGameScore = (
  userId: string,
  gameId: string,
  score: number
): Record<string, StoredGameScore> => {
  const gameScores = getUserGameScores(userId);
  const existing = gameScores[gameId];
  const now = new Date().toISOString();

  const nextScore: StoredGameScore = {
    gameId,
    latestScore: score,
    bestScore: Math.max(existing?.bestScore ?? 0, score),
    attempts: (existing?.attempts ?? 0) + 1,
    updatedAt: now
  };

  const nextScores = {
    ...gameScores,
    [gameId]: nextScore
  };
  writeStorage(scopedKey(GAME_PREFIX, userId), nextScores);
  return nextScores;
};

export const getUserCourseProgressMap = (
  userId: string
): Record<string, CourseProgressRecord> =>
  readStorage<Record<string, CourseProgressRecord>>(
    scopedKey(COURSE_PROGRESS_PREFIX, userId),
    {}
  );

export const getCourseProgress = (
  userId: string,
  courseId: string
): CourseProgressRecord => {
  const progressMap = getUserCourseProgressMap(userId);
  const existing = progressMap[courseId];
  if (existing) return existing;

  return {
    courseId,
    completedLectures: [],
    completedModules: [],
    percentComplete: 0,
    updatedAt: new Date().toISOString()
  };
};

const isModuleComplete = (
  lectureIds: string[],
  completedLectureSet: Set<string>
): boolean => lectureIds.every((lectureId) => completedLectureSet.has(lectureId));

export const markLectureCompleted = ({
  userId,
  course,
  moduleId,
  lectureId
}: {
  userId: string;
  course: LearningCourse;
  moduleId: string;
  lectureId: string;
}): CourseProgressRecord => {
  const progressMap = getUserCourseProgressMap(userId);
  const current = getCourseProgress(userId, course.id);
  const completedLectureSet = new Set(current.completedLectures);
  completedLectureSet.add(lectureId);

  const completedModuleIds = course.modules
    .filter((moduleItem) =>
      isModuleComplete(
        moduleItem.videoLectures.map((lecture) => lecture.id),
        completedLectureSet
      )
    )
    .map((moduleItem) => moduleItem.id);

  const totalLectures = getCourseLectureCount(course);
  const percentComplete = Math.min(
    100,
    Math.round((completedLectureSet.size / totalLectures) * 100)
  );

  const now = new Date().toISOString();
  const nextRecord: CourseProgressRecord = {
    courseId: course.id,
    completedLectures: Array.from(completedLectureSet),
    completedModules: completedModuleIds,
    activeLectureId: lectureId,
    percentComplete,
    updatedAt: now,
    completedAt:
      percentComplete === 100 ? current.completedAt ?? now : current.completedAt
  };

  const nextMap = {
    ...progressMap,
    [course.id]: nextRecord
  };
  writeStorage(scopedKey(COURSE_PROGRESS_PREFIX, userId), nextMap);
  return nextRecord;
};

export const setActiveLecture = ({
  userId,
  courseId,
  lectureId
}: {
  userId: string;
  courseId: string;
  lectureId: string;
}): CourseProgressRecord => {
  const progressMap = getUserCourseProgressMap(userId);
  const current = getCourseProgress(userId, courseId);
  const nextRecord: CourseProgressRecord = {
    ...current,
    activeLectureId: lectureId,
    updatedAt: new Date().toISOString()
  };

  const nextMap = {
    ...progressMap,
    [courseId]: nextRecord
  };
  writeStorage(scopedKey(COURSE_PROGRESS_PREFIX, userId), nextMap);
  return nextRecord;
};

export const getAssignmentSubmissions = (
  userId: string
): AssignmentSubmissionRecord[] =>
  readStorage<AssignmentSubmissionRecord[]>(scopedKey(ASSIGNMENT_PREFIX, userId), []);

export const getAssignmentSubmission = ({
  userId,
  courseId,
  moduleId,
  assignmentId
}: {
  userId: string;
  courseId: string;
  moduleId: string;
  assignmentId: string;
}): AssignmentSubmissionRecord | undefined =>
  getAssignmentSubmissions(userId).find(
    (record) =>
      record.courseId === courseId &&
      record.moduleId === moduleId &&
      record.assignmentId === assignmentId
  );

export const saveAssignmentSubmission = ({
  userId,
  courseId,
  moduleId,
  assignmentId,
  fileName,
  fileSize
}: {
  userId: string;
  courseId: string;
  moduleId: string;
  assignmentId: string;
  fileName: string;
  fileSize: number;
}): AssignmentSubmissionRecord => {
  const submissions = getAssignmentSubmissions(userId);
  const now = new Date().toISOString();

  const nextRecord: AssignmentSubmissionRecord = {
    id: generateId("SUB"),
    courseId,
    moduleId,
    assignmentId,
    fileName,
    fileSize,
    submittedAt: now,
    status: "Submitted"
  };

  const withoutExisting = submissions.filter(
    (record) =>
      !(
        record.courseId === courseId &&
        record.moduleId === moduleId &&
        record.assignmentId === assignmentId
      )
  );

  const nextSubmissions = [nextRecord, ...withoutExisting];
  writeStorage(scopedKey(ASSIGNMENT_PREFIX, userId), nextSubmissions);
  return nextRecord;
};

export const getUserCertificates = (userId: string): CertificateRecord[] =>
  readStorage<CertificateRecord[]>(scopedKey(CERTIFICATE_PREFIX, userId), []);

export const issueCourseCertificate = ({
  userId,
  userName,
  course
}: {
  userId: string;
  userName: string;
  course: LearningCourse;
}): CertificateRecord => {
  const progress = getCourseProgress(userId, course.id);
  if (progress.percentComplete < 100) {
    throw new Error("Course must be 100% complete to generate a certificate.");
  }

  const certificates = getUserCertificates(userId);
  const existing = certificates.find((item) => item.courseId === course.id);
  if (existing) {
    return existing;
  }

  const issuedAt = new Date().toISOString();
  const certificateRecord: CertificateRecord = {
    id: generateId("TAC-CERT"),
    userId,
    userName,
    courseId: course.id,
    courseName: course.title,
    completionDate: formatIsoDate(progress.completedAt ?? issuedAt),
    issuedAt
  };

  const nextCertificates = [certificateRecord, ...certificates];
  writeStorage(scopedKey(CERTIFICATE_PREFIX, userId), nextCertificates);
  return certificateRecord;
};

export const findCertificateById = (
  certificateId: string
): CertificateRecord | null => {
  if (!isBrowser()) return null;

  const { localStorage } = window;
  const matchingKeys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith(CERTIFICATE_PREFIX)) {
      matchingKeys.push(key);
    }
  }

  for (const key of matchingKeys) {
    const certificates = readStorage<CertificateRecord[]>(key, []);
    const record = certificates.find((certificate) => certificate.id === certificateId);
    if (record) return record;
  }

  return null;
};


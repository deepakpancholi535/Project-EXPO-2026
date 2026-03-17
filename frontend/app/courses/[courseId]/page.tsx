"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Award, BookOpenCheck, FolderCheck, Layers } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";
import { AssignmentUploadCard } from "@/components/courses/assignment-upload-card";
import { VideoLecturePlayer } from "@/components/courses/video-lecture-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getCourseById } from "@/lib/learning-content";
import {
  getAssignmentSubmissions,
  getCourseProgress,
  issueCourseCertificate,
  markLectureCompleted,
  saveAssignmentSubmission,
  setActiveLecture,
  type AssignmentSubmissionRecord,
  type CourseProgressRecord
} from "@/lib/learning-store";

interface FlatLecture {
  moduleId: string;
  moduleTitle: string;
  lectureId: string;
  lectureTitle: string;
}

const assignmentKey = (submission: AssignmentSubmissionRecord): string =>
  `${submission.courseId}:${submission.moduleId}:${submission.assignmentId}`;

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const course = useMemo(
    () => (params.courseId ? getCourseById(params.courseId) : undefined),
    [params.courseId]
  );

  const flattenedLectures = useMemo<FlatLecture[]>(
    () =>
      (course?.modules ?? []).flatMap((moduleItem) =>
        moduleItem.videoLectures.map((lecture) => ({
          moduleId: moduleItem.id,
          moduleTitle: moduleItem.title,
          lectureId: lecture.id,
          lectureTitle: lecture.title
        }))
      ),
    [course]
  );

  const [progress, setProgress] = useState<CourseProgressRecord | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmissionRecord[]>([]);
  const [activeLectureId, setActiveLectureId] = useState<string>("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!user?.id || !course || flattenedLectures.length === 0) return;
    const storedProgress = getCourseProgress(user.id, course.id);
    const defaultLectureId = flattenedLectures[0].lectureId;
    const nextActiveLectureId = storedProgress.activeLectureId ?? defaultLectureId;

    setProgress(storedProgress);
    setActiveLectureId(nextActiveLectureId);
    setSubmissions(getAssignmentSubmissions(user.id));
  }, [course, flattenedLectures, user?.id]);

  const lectureIndex = useMemo(
    () => flattenedLectures.findIndex((item) => item.lectureId === activeLectureId),
    [flattenedLectures, activeLectureId]
  );

  const safeLectureIndex = lectureIndex >= 0 ? lectureIndex : 0;
  const currentLectureMeta = flattenedLectures[safeLectureIndex];
  const currentModule = course?.modules.find(
    (moduleItem) => moduleItem.id === currentLectureMeta?.moduleId
  );
  const currentLecture = currentModule?.videoLectures.find(
    (lecture) => lecture.id === currentLectureMeta?.lectureId
  );

  const submissionMap = useMemo(() => {
    return submissions.reduce<Record<string, AssignmentSubmissionRecord>>(
      (accumulator, submission) => {
        accumulator[assignmentKey(submission)] = submission;
        return accumulator;
      },
      {}
    );
  }, [submissions]);

  if (!course) {
    return (
      <ProtectedRoute>
        <PageShell>
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            Course not found.
          </p>
        </PageShell>
      </ProtectedRoute>
    );
  }

  if (!currentLecture || !currentModule || !user?.id || !progress) {
    return (
      <ProtectedRoute>
        <PageShell>
          <p className="text-muted-foreground">Loading course content...</p>
        </PageShell>
      </ProtectedRoute>
    );
  }

  const canGoPrevious = safeLectureIndex > 0;
  const canGoNext = safeLectureIndex < flattenedLectures.length - 1;
  const isLectureCompleted = progress.completedLectures.includes(currentLecture.id);

  return (
    <ProtectedRoute>
      <PageShell className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/70 p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{course.level}</Badge>
                <Badge variant="outline">{course.instructor}</Badge>
              </div>
              <h1 className="font-heading text-4xl font-bold">{course.title}</h1>
              <p className="mt-2 max-w-3xl text-muted-foreground">{course.description}</p>
            </div>

            <div className="min-w-[220px] rounded-xl border border-border/70 bg-card/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Completion
              </p>
              <p className="mt-1 text-3xl font-bold">{progress.percentComplete}%</p>
              <Progress className="mt-2" value={progress.percentComplete} />
            </div>
          </div>
        </section>

        <VideoLecturePlayer
          lecture={currentLecture}
          isCompleted={isLectureCompleted}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onMarkComplete={() => {
            const nextProgress = markLectureCompleted({
              userId: user.id,
              course,
              moduleId: currentModule.id,
              lectureId: currentLecture.id
            });
            setProgress(nextProgress);
            setFeedback(`Marked "${currentLecture.title}" as completed.`);
          }}
          onPrevious={() => {
            if (!canGoPrevious) return;
            const previousLecture = flattenedLectures[safeLectureIndex - 1];
            setActiveLectureId(previousLecture.lectureId);
            setActiveLecture({
              userId: user.id,
              courseId: course.id,
              lectureId: previousLecture.lectureId
            });
          }}
          onNext={() => {
            if (!canGoNext) return;
            const nextLecture = flattenedLectures[safeLectureIndex + 1];
            setActiveLectureId(nextLecture.lectureId);
            setActiveLecture({
              userId: user.id,
              courseId: course.id,
              lectureId: nextLecture.lectureId
            });
          }}
        />

        {feedback && (
          <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm">
            {feedback}
          </p>
        )}

        <section className="grid gap-4 lg:grid-cols-2">
          {course.modules.map((moduleItem) => (
            <Card key={moduleItem.id}>
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-xl">
                  <Layers className="h-5 w-5 text-primary" />
                  {moduleItem.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{moduleItem.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {moduleItem.videoLectures.map((lecture) => {
                    const completed = progress.completedLectures.includes(lecture.id);
                    const active = activeLectureId === lecture.id;
                    return (
                      <button
                        key={lecture.id}
                        type="button"
                        onClick={() => {
                          setActiveLectureId(lecture.id);
                          setActiveLecture({
                            userId: user.id,
                            courseId: course.id,
                            lectureId: lecture.id
                          });
                        }}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left",
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card/50",
                          completed && "border-emerald-500/40 bg-emerald-500/10"
                        )}
                      >
                        <p className="font-semibold">{lecture.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{lecture.duration}</p>
                      </button>
                    );
                  })}
                </div>

                <AssignmentUploadCard
                  assignment={moduleItem.assignment}
                  submission={
                    submissionMap[
                      `${course.id}:${moduleItem.id}:${moduleItem.assignment.id}`
                    ]
                  }
                  onSubmit={(file) => {
                    const savedSubmission = saveAssignmentSubmission({
                      userId: user.id,
                      courseId: course.id,
                      moduleId: moduleItem.id,
                      assignmentId: moduleItem.assignment.id,
                      fileName: file.name,
                      fileSize: file.size
                    });

                    setSubmissions((previous) => {
                      const withoutExisting = previous.filter(
                        (item) =>
                          !(
                            item.courseId === savedSubmission.courseId &&
                            item.moduleId === savedSubmission.moduleId &&
                            item.assignmentId === savedSubmission.assignmentId
                          )
                      );
                      return [savedSubmission, ...withoutExisting];
                    });

                    setFeedback(`Assignment uploaded for ${moduleItem.title}.`);
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-primary" />
              Course Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Finish all lectures to generate your verified certificate with QR code.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  try {
                    const certificate = issueCourseCertificate({
                      userId: user.id,
                      userName: user.name,
                      course
                    });
                    router.push(`/certificates/${certificate.id}`);
                  } catch (error) {
                    setFeedback(
                      error instanceof Error
                        ? error.message
                        : "Unable to generate certificate yet."
                    );
                  }
                }}
                disabled={progress.percentComplete < 100}
              >
                <Award className="mr-2 h-4 w-4" />
                Generate Certificate
              </Button>
              <Button variant="outline" asChild>
                <Link href="/certificates">
                  <FolderCheck className="mr-2 h-4 w-4" />
                  View My Certificates
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </ProtectedRoute>
  );
}

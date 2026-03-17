"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/components/auth-provider";
import { CourseCard } from "@/components/courses/course-card";
import { Card, CardContent } from "@/components/ui/card";
import { learningCourses } from "@/lib/learning-content";
import { getUserCourseProgressMap, type CourseProgressRecord } from "@/lib/learning-store";

export default function CoursesPage() {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgressRecord>>(
    {}
  );

  useEffect(() => {
    if (!user?.id) return;
    setProgressMap(getUserCourseProgressMap(user.id));
  }, [user?.id]);

  const completedCourses = useMemo(
    () =>
      Object.values(progressMap).filter((progress) => progress.percentComplete >= 100)
        .length,
    [progressMap]
  );

  return (
    <ProtectedRoute>
      <PageShell className="space-y-8">
        <section className="rounded-3xl border border-border/70 bg-card/70 p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Course Platform</p>
              <h1 className="font-heading text-4xl font-bold">Learning Paths</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Structured courses inspired by modern springboard platforms with
                module-level videos, assignments, and completion tracking.
              </p>
            </div>
            <Card className="min-w-[230px] border-border/70">
              <CardContent className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Course Progress
                </p>
                <p className="inline-flex items-center gap-2 text-3xl font-bold">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  {completedCourses}/{learningCourses.length}
                </p>
                <p className="text-xs text-muted-foreground">Courses completed</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {learningCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progressPercent={progressMap[course.id]?.percentComplete ?? 0}
            />
          ))}
        </section>
      </PageShell>
    </ProtectedRoute>
  );
}


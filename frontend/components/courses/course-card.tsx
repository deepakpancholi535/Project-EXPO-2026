import Link from "next/link";
import { ArrowRight, BookOpenCheck, Layers, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type LearningCourse, getCourseLectureCount, programLabels } from "@/lib/learning-content";

interface CourseCardProps {
  course: LearningCourse;
  progressPercent: number;
}

export const CourseCard = ({ course, progressPercent }: CourseCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{programLabels[course.program]}</Badge>
          <Badge variant="outline">{course.level}</Badge>
        </div>
        <CardTitle className="text-2xl">{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-card/40 p-3">
            <p className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
              <BookOpenCheck className="h-3.5 w-3.5 text-primary" />
              Modules
            </p>
            <p className="mt-1 text-lg font-semibold">{course.modules.length}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/40 p-3">
            <p className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
              <PlayCircle className="h-3.5 w-3.5 text-primary" />
              Lectures
            </p>
            <p className="mt-1 text-lg font-semibold">{getCourseLectureCount(course)}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/40 p-3">
            <p className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Instructor
            </p>
            <p className="mt-1 text-sm font-semibold">{course.instructor}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Progress</p>
            <p className="font-semibold">{progressPercent}%</p>
          </div>
          <Progress value={progressPercent} />
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/courses/${course.id}`}>
            Continue Course
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};


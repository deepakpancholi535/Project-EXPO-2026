import { CheckCircle2, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VideoLecture } from "@/lib/learning-content";

interface VideoLecturePlayerProps {
  lecture: VideoLecture;
  isCompleted: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onMarkComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const VideoLecturePlayer = ({
  lecture,
  isCompleted,
  canGoPrevious,
  canGoNext,
  onMarkComplete,
  onPrevious,
  onNext
}: VideoLecturePlayerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PlayCircle className="h-6 w-6 text-primary" />
          {lecture.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {lecture.description} • {lecture.duration}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border/70">
          <div className="aspect-video">
            <iframe
              src={lecture.videoUrl}
              title={lecture.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Lecture
          </Button>
          <Button variant="outline" onClick={onNext} disabled={!canGoNext}>
            Next Lecture
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={onMarkComplete} disabled={isCompleted} className="ml-auto">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {isCompleted ? "Completed" : "Mark as Completed"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


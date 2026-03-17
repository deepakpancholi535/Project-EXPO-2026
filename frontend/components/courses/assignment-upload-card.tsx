"use client";

import { useMemo, useState } from "react";
import { Clock3, FileUp, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssignmentSubmissionRecord } from "@/lib/learning-store";
import type { ModuleAssignment } from "@/lib/learning-content";

interface AssignmentUploadCardProps {
  assignment: ModuleAssignment;
  submission?: AssignmentSubmissionRecord;
  onSubmit: (file: File) => void;
}

const formatBytes = (fileSize: number): string => {
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
};

export const AssignmentUploadCard = ({
  assignment,
  submission,
  onSubmit
}: AssignmentUploadCardProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const deadlineLabel = useMemo(() => {
    return new Date(assignment.deadline).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }, [assignment.deadline]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{assignment.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{assignment.description}</p>

        <div className="rounded-xl border border-border/70 bg-card/50 p-3 text-sm">
          <p className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            Deadline: <strong className="text-foreground">{deadlineLabel}</strong>
          </p>
        </div>

        <label className="block cursor-pointer rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground hover:border-primary/40">
          <span className="inline-flex items-center gap-2">
            <FileUp className="h-4 w-4 text-primary" />
            {selectedFile ? selectedFile.name : "Choose assignment file"}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
            }}
          />
        </label>

        <Button
          onClick={() => selectedFile && onSubmit(selectedFile)}
          disabled={!selectedFile}
          className="w-full"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Assignment
        </Button>

        <div className="rounded-xl border border-border/70 bg-card/50 p-3 text-sm">
          <p className="text-muted-foreground">Submission Status</p>
          {submission ? (
            <div className="mt-1 space-y-1">
              <p className="font-semibold text-emerald-600 dark:text-emerald-300">
                {submission.status}
              </p>
              <p>{submission.fileName}</p>
              <p className="text-muted-foreground">{formatBytes(submission.fileSize)}</p>
              <p className="text-muted-foreground">
                {new Date(submission.submittedAt).toLocaleString("en-US")}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-muted-foreground">Not submitted yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


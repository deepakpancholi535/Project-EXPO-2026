"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PatternRecognitionGameProps {
  onComplete: (score: number) => void;
}

const options = ["Steady decline", "Strong upward trend", "No pattern"];

export const PatternRecognitionGame = ({
  onComplete
}: PatternRecognitionGameProps) => {
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!selected) return;
    const score = selected === "Strong upward trend" ? 100 : 45;
    setSubmitted(true);
    onComplete(score);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pattern Recognition Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="rounded-xl border border-border bg-card/50 p-4 text-sm">
          Weekly active users: <strong>120, 140, 156, 182, 210, 235</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Which trend best describes this dataset?
        </p>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(option)}
              className={cn(
                "w-full rounded-xl border p-3 text-left text-sm transition-colors",
                selected === option
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/60 hover:bg-secondary/60"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <Button onClick={submit} disabled={!selected || submitted}>
          {submitted ? "Submitted" : "Submit Insight"}
        </Button>
      </CardContent>
    </Card>
  );
};

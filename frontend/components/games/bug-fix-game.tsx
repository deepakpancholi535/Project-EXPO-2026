"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BugFixGameProps {
  onComplete: (score: number) => void;
}

const options = [
  "if (a = b) { return true; }",
  "if (a === b) { return true; }",
  "if (a == b) { return false; }"
];

export const BugFixGame = ({ onComplete }: BugFixGameProps) => {
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!selected) return;
    const score = selected === options[1] ? 100 : 40;
    setSubmitted(true);
    onComplete(score);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bug Fix Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
{`function isSame(a, b) {
  if (a = b) {
    return true
  }
  return false
}`}
        </pre>
        <p className="text-sm text-muted-foreground">
          Select the best fix for the conditional bug.
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
              <code>{option}</code>
            </button>
          ))}
        </div>
        <Button onClick={submit} disabled={!selected || submitted}>
          {submitted ? "Submitted" : "Submit Fix"}
        </Button>
      </CardContent>
    </Card>
  );
};

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LogicPuzzleGameProps {
  onComplete: (score: number) => void;
}

const answers = ["8", "9", "10"];

export const LogicPuzzleGame = ({ onComplete }: LogicPuzzleGameProps) => {
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    const score = selected === "9" ? 100 : 50;
    setSubmitted(true);
    onComplete(score);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logic Puzzle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
{`const values = [1, 2, 3]
const sum = values.reduce((acc, value) => acc + value, 0)
console.log(sum + values.length)`}
        </pre>
        <p className="text-sm text-muted-foreground">
          Predict the output and submit your answer.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {answers.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSelected(item)}
              className={cn(
                "rounded-xl border p-3 text-sm transition-colors",
                selected === item
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/60 hover:bg-secondary/60"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={!selected || submitted}>
          {submitted ? "Submitted" : "Submit Answer"}
        </Button>
      </CardContent>
    </Card>
  );
};

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartSelectionGameProps {
  onComplete: (score: number) => void;
}

const options = [
  "Pie chart for monthly revenue growth",
  "Line chart for monthly revenue growth",
  "Scatter plot for category split"
];

export const ChartSelectionGame = ({ onComplete }: ChartSelectionGameProps) => {
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!selected) return;
    const score = selected === options[1] ? 100 : 50;
    setSubmitted(true);
    onComplete(score);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Selection Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You need to show how revenue changes month-by-month over one year.
          Pick the best chart choice.
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
          {submitted ? "Submitted" : "Submit Choice"}
        </Button>
      </CardContent>
    </Card>
  );
};

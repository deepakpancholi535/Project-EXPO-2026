"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ColorPaletteGameProps {
  onComplete: (score: number) => void;
}

const options = [
  { label: "Neon green text on bright yellow background", value: "bad-1" },
  { label: "Dark navy text on soft off-white background", value: "good" },
  { label: "Red text on orange background", value: "bad-2" }
];

export const ColorPaletteGame = ({ onComplete }: ColorPaletteGameProps) => {
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!selected) return;
    const score = selected === "good" ? 100 : 40;
    setSubmitted(true);
    onComplete(score);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Palette Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Choose the most accessible and visually balanced palette.
        </p>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              className={cn(
                "w-full rounded-xl border p-3 text-left text-sm transition-colors",
                selected === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/60 hover:bg-secondary/60"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Button onClick={submit} disabled={!selected || submitted}>
          {submitted ? "Submitted" : "Submit Palette"}
        </Button>
      </CardContent>
    </Card>
  );
};

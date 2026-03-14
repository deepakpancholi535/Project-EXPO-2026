"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LayoutChallengeGameProps {
  onComplete: (score: number) => void;
}

const correctOrder = ["Header", "Hero", "Feature Grid", "CTA Footer"];

export const LayoutChallengeGame = ({ onComplete }: LayoutChallengeGameProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const remaining = useMemo(
    () => correctOrder.filter((item) => !selected.includes(item)),
    [selected]
  );

  const addItem = (item: string) => {
    if (submitted || selected.includes(item)) return;
    setSelected((prev) => [...prev, item]);
  };

  const reset = () => setSelected([]);

  const submit = () => {
    if (selected.length !== correctOrder.length) return;
    const matches = selected.filter((item, idx) => item === correctOrder[idx]).length;
    const score = Math.round((matches / correctOrder.length) * 100);
    setSubmitted(true);
    onComplete(score);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Layout Challenge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Arrange the sections in a logical UX flow for a landing page.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {remaining.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addItem(item)}
              className="rounded-xl border border-border bg-card/60 p-3 text-left text-sm hover:bg-secondary/60"
            >
              {item}
            </button>
          ))}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Your order</p>
          <ol className="space-y-2">
            {selected.map((item, index) => (
              <li
                key={item}
                className={cn(
                  "rounded-xl border p-3 text-sm",
                  submitted && item === correctOrder[index]
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-border bg-card/60"
                )}
              >
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={reset} disabled={submitted}>
            Reset
          </Button>
          <Button
            onClick={submit}
            disabled={selected.length !== correctOrder.length || submitted}
          >
            {submitted ? "Submitted" : "Submit Layout"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

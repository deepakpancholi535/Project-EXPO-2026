"use client";

import { useMemo, useState } from "react";
import { BugFixGame } from "@/components/games/bug-fix-game";
import { LogicPuzzleGame } from "@/components/games/logic-puzzle-game";
import { PatternRecognitionGame } from "@/components/games/pattern-recognition-game";
import { ChartSelectionGame } from "@/components/games/chart-selection-game";
import { ColorPaletteGame } from "@/components/games/color-palette-game";
import { LayoutChallengeGame } from "@/components/games/layout-challenge-game";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TrialGameStageProps {
  careerSlug: string;
  onComplete: (score: number) => void;
}

export const TrialGameStage = ({ careerSlug, onComplete }: TrialGameStageProps) => {
  const [scoreA, setScoreA] = useState<number | null>(null);
  const [scoreB, setScoreB] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canFinish = scoreA !== null && scoreB !== null && !submitted;

  const averageScore = useMemo(() => {
    if (scoreA === null || scoreB === null) return 0;
    return Math.round((scoreA + scoreB) / 2);
  }, [scoreA, scoreB]);

  const submitCombined = () => {
    if (!canFinish) return;
    setSubmitted(true);
    onComplete(averageScore);
  };

  return (
    <div className="space-y-4">
      {careerSlug === "software-engineer" && (
        <>
          <BugFixGame onComplete={setScoreA} />
          <LogicPuzzleGame onComplete={setScoreB} />
        </>
      )}

      {careerSlug === "data-analyst" && (
        <>
          <PatternRecognitionGame onComplete={setScoreA} />
          <ChartSelectionGame onComplete={setScoreB} />
        </>
      )}

      {careerSlug === "ui-ux-designer" && (
        <>
          <ColorPaletteGame onComplete={setScoreA} />
          <LayoutChallengeGame onComplete={setScoreB} />
        </>
      )}

      <Card>
        <CardContent className="space-y-3 pt-6">
          <p className="text-sm text-muted-foreground">
            Combined mini-game score updates once both activities are submitted.
          </p>
          <p className="font-medium">Current game score: {averageScore}%</p>
          <Button onClick={submitCombined} disabled={!canFinish}>
            {submitted ? "Game Score Saved" : "Save Mini-Game Score"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

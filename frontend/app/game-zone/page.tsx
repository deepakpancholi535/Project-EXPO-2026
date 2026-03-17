"use client";

import { useEffect, useMemo, useState } from "react";
import { Gamepad2, Medal, Trophy } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";
import { GameZoneCard } from "@/components/game-zone/game-zone-card";
import { BugFixGame } from "@/components/games/bug-fix-game";
import { ChartSelectionGame } from "@/components/games/chart-selection-game";
import { ColorPaletteGame } from "@/components/games/color-palette-game";
import { LayoutChallengeGame } from "@/components/games/layout-challenge-game";
import { LogicPuzzleGame } from "@/components/games/logic-puzzle-game";
import { PatternRecognitionGame } from "@/components/games/pattern-recognition-game";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { learningGames, type GameComponentKey } from "@/lib/learning-content";
import { getUserGameScores, saveUserGameScore, type StoredGameScore } from "@/lib/learning-store";

const gameComponentMap: Record<
  GameComponentKey,
  (props: { onComplete: (score: number) => void }) => JSX.Element
> = {
  "bug-fix-game": BugFixGame,
  "logic-puzzle-game": LogicPuzzleGame,
  "pattern-recognition-game": PatternRecognitionGame,
  "chart-selection-game": ChartSelectionGame,
  "color-palette-game": ColorPaletteGame,
  "layout-challenge-game": LayoutChallengeGame
};

export default function GameZonePage() {
  const { user } = useAuth();
  const [activeGameId, setActiveGameId] = useState(learningGames[0]?.id ?? "");
  const [gameScores, setGameScores] = useState<Record<string, StoredGameScore>>({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    setGameScores(getUserGameScores(user.id));
  }, [user?.id]);

  const activeGame = useMemo(
    () => learningGames.find((game) => game.id === activeGameId) ?? learningGames[0],
    [activeGameId]
  );

  const totalBestPoints = useMemo(
    () =>
      Object.values(gameScores).reduce(
        (total, scoreRecord) => total + scoreRecord.bestScore,
        0
      ),
    [gameScores]
  );

  if (!activeGame) {
    return null;
  }

  const ActiveGameComponent = gameComponentMap[activeGame.componentKey];

  return (
    <ProtectedRoute>
      <PageShell className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/70 p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Gamification Hub</p>
              <h1 className="font-heading text-4xl font-bold">Game Zone</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Practice concepts through short games. Every game saves your best
                score and contributes to leaderboard points.
              </p>
            </div>
            <div className="grid min-w-[220px] gap-2">
              <div className="rounded-xl border border-border/70 bg-card/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Best Score Points
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-2xl font-bold">
                  <Trophy className="h-5 w-5 text-primary" />
                  {totalBestPoints}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Games Attempted
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-2xl font-bold">
                  <Medal className="h-5 w-5 text-primary" />
                  {Object.keys(gameScores).length}/{learningGames.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learningGames.map((game) => (
            <GameZoneCard
              key={game.id}
              game={game}
              bestScore={gameScores[game.id]?.bestScore}
              onPlay={(gameId) => {
                setActiveGameId(gameId);
                setFeedback("");
              }}
            />
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-2xl">
              <Gamepad2 className="h-6 w-6 text-primary" />
              {activeGame.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Click submit inside the game and we will track your latest and best score.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActiveGameComponent
              key={activeGame.id}
              onComplete={(score) => {
                if (!user?.id) return;
                const nextScores = saveUserGameScore(user.id, activeGame.id, score);
                setGameScores(nextScores);
                setFeedback(
                  `Saved ${score}% for ${activeGame.title}. Best score: ${nextScores[activeGame.id]?.bestScore ?? score}%`
                );
              }}
            />
            {feedback && (
              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
                {feedback}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Score Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {learningGames.map((game) => {
              const score = gameScores[game.id];
              return (
                <div
                  key={game.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-card/50 p-3 text-sm"
                >
                  <p className="font-medium">{game.title}</p>
                  {score ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Best {score.bestScore}%</Badge>
                      <Badge variant="outline">Attempts {score.attempts}</Badge>
                    </div>
                  ) : (
                    <Badge variant="outline">Not attempted</Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </PageShell>
    </ProtectedRoute>
  );
}


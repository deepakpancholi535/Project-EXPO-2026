"use client";

import { useEffect, useMemo, useState } from "react";
import { Medal, Trophy } from "lucide-react";
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
  const [activeGameId, setActiveGameId] = useState("");
  const [playSessions, setPlaySessions] = useState<Record<string, number>>({});
  const [gameScores, setGameScores] = useState<Record<string, StoredGameScore>>({});
  const [feedbackByGame, setFeedbackByGame] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user?.id) return;
    setGameScores(getUserGameScores(user.id));
  }, [user?.id]);

  const totalBestPoints = useMemo(
    () =>
      Object.values(gameScores).reduce(
        (total, scoreRecord) => total + scoreRecord.bestScore,
        0
      ),
    [gameScores]
  );

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
          {learningGames.map((game) => {
            const GameComponent = gameComponentMap[game.componentKey];
            const gameScore = gameScores[game.id];
            const isActive = activeGameId === game.id;
            const session = playSessions[game.id] ?? 0;

            return (
              <GameZoneCard
                key={game.id}
                game={game}
                bestScore={gameScore?.bestScore}
                attempts={gameScore?.attempts}
                isActive={isActive}
                feedback={feedbackByGame[game.id]}
                onPlay={(gameId) => {
                  if (activeGameId === gameId) {
                    setActiveGameId("");
                    return;
                  }

                  setActiveGameId(gameId);
                  setPlaySessions((previous) => ({
                    ...previous,
                    [gameId]: (previous[gameId] ?? 0) + 1
                  }));
                }}
              >
                <GameComponent
                  key={`${game.id}-${session}`}
                  onComplete={(score) => {
                    if (!user?.id) return;
                    const nextScores = saveUserGameScore(user.id, game.id, score);
                    setGameScores(nextScores);
                    setFeedbackByGame((previous) => ({
                      ...previous,
                      [game.id]: `Saved ${score}% for ${game.title}. Best score: ${nextScores[game.id]?.bestScore ?? score}%`
                    }));
                  }}
                />
              </GameZoneCard>
            );
          })}
        </section>

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

"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Timer, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type LearningGame, programLabels } from "@/lib/learning-content";

interface GameZoneCardProps {
  game: LearningGame;
  bestScore?: number;
  attempts?: number;
  isActive: boolean;
  feedback?: string;
  children?: ReactNode;
  onPlay: (gameId: string) => void;
}

export const GameZoneCard = ({
  game,
  bestScore,
  attempts,
  isActive,
  feedback,
  children,
  onPlay
}: GameZoneCardProps) => {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border-border/80">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{programLabels[game.program]}</Badge>
            <Badge variant="outline">{game.difficulty}</Badge>
            {isActive && <Badge variant="success">Now Playing</Badge>}
          </div>
          <CardTitle className="text-2xl">{game.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{game.description}</p>
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/50 p-3 text-sm">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Timer className="h-4 w-4 text-primary" />
              {game.estimatedMinutes} min
            </span>
            <span className="font-semibold">
              Best Score: {typeof bestScore === "number" ? `${bestScore}%` : "--"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Attempts: {attempts ?? 0}
          </p>
          {feedback && (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
              {feedback}
            </p>
          )}
          {isActive && children ? (
            <div className="rounded-2xl border border-border/70 bg-card/60 p-3">
              {children}
            </div>
          ) : null}
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={() => onPlay(game.id)}>
            {isActive ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Close Game
              </>
            ) : (
              <>
                <Gamepad2 className="mr-2 h-4 w-4" />
                Play Game
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Flag, Gamepad2, ListChecks } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { TrialGameStage } from "@/components/trial-game-stage";
import { trialApi, resultApi } from "@/lib/api";
import { Career, Trial } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function TrialPage() {
  const params = useParams<{ career: string }>();
  const router = useRouter();

  const [career, setCareer] = useState<Career | null>(null);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [taskScore, setTaskScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [gameScore, setGameScore] = useState(0);

  const [taskResponse, setTaskResponse] = useState("");
  const [projectResponse, setProjectResponse] = useState("");
  const [quizChoice, setQuizChoice] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!params.career) return;

    const loadTrial = async () => {
      try {
        const payload = await trialApi.getTrialByCareer(params.career);
        setCareer(payload.career);
        setTrial(payload.trial);

        try {
          const progressPayload = await trialApi.getMyProgress(params.career);
          const progress = progressPayload.progress;
          setCurrentDay(progress.currentDay ?? 1);
          setCompletedDays(progress.completedDays ?? []);
          setTaskScore(progress.taskScore ?? 0);
          setQuizScore(progress.quizScore ?? 0);
          setGameScore(progress.gameScore ?? 0);
        } catch {
          // no persisted progress yet
        }
      } finally {
        setLoading(false);
      }
    };

    void loadTrial();
  }, [params.career]);

  const totalDays = trial?.tasks.length ?? 5;

  const currentStep = useMemo(() => {
    return trial?.tasks.find((step) => step.day === currentDay);
  }, [trial, currentDay]);

  const progressPercent = Math.round((completedDays.length / totalDays) * 100);

  const saveProgress = async ({
    nextDay = currentDay,
    nextCompleted = completedDays,
    nextTaskScore = taskScore,
    nextQuizScore = quizScore,
    nextGameScore = gameScore
  }: {
    nextDay?: number;
    nextCompleted?: number[];
    nextTaskScore?: number;
    nextQuizScore?: number;
    nextGameScore?: number;
  }) => {
    if (!params.career) return;
    setSaving(true);
    try {
      await trialApi.saveProgress(params.career, {
        currentDay: nextDay,
        completedDays: nextCompleted,
        taskScore: nextTaskScore,
        quizScore: nextQuizScore,
        gameScore: nextGameScore,
        status: nextCompleted.length >= totalDays ? "completed" : "in_progress"
      });
    } finally {
      setSaving(false);
    }
  };

  const completeCurrentDay = async () => {
    if (!currentStep) return;

    let nextTaskScore = taskScore;
    let nextQuizScore = quizScore;
    let nextGameScore = gameScore;
    let nextFeedback = "Progress saved.";

    if (currentStep.type === "task") {
      if (taskResponse.trim().length < 20) {
        setFeedback("Write a bit more detail to complete Day 2.");
        return;
      }
      nextTaskScore = taskResponse.trim().length > 110 ? 90 : 70;
      setTaskScore(nextTaskScore);
      nextFeedback = `Task completed. Task score updated to ${nextTaskScore}%.`;
    }

    if (currentStep.type === "quiz") {
      if (!quizChoice) {
        setFeedback("Select one answer to finish the quiz.");
        return;
      }
      nextQuizScore = quizChoice === currentStep.answer ? 100 : 45;
      setQuizScore(nextQuizScore);
      nextFeedback = `Quiz completed. Quiz score is ${nextQuizScore}%.`;
    }

    if (currentStep.type === "game") {
      if (gameScore === 0) {
        setFeedback("Finish both mini-games and save the game score first.");
        return;
      }
      nextGameScore = gameScore;
      nextFeedback = `Mini-game day completed with ${nextGameScore}% score.`;
    }

    if (currentStep.type === "project") {
      if (projectResponse.trim().length < 40) {
        setFeedback("Add a short mini-project plan to complete Day 5.");
        return;
      }
      const projectScore = projectResponse.trim().length > 150 ? 92 : 75;
      nextTaskScore = Math.round((taskScore + projectScore) / 2);
      setTaskScore(nextTaskScore);
      nextFeedback = `Mini project completed. Final task score is ${nextTaskScore}%.`;
    }

    const nextCompleted = Array.from(new Set([...completedDays, currentDay])).sort(
      (a, b) => a - b
    );
    const nextDay = Math.min(totalDays, currentDay + 1);

    setCompletedDays(nextCompleted);
    setCurrentDay(nextDay);
    setFeedback(nextFeedback);

    await saveProgress({
      nextDay,
      nextCompleted,
      nextTaskScore,
      nextQuizScore,
      nextGameScore
    });
  };

  const submitResult = async () => {
    if (!career || completedDays.length < totalDays) return;

    setSubmitting(true);
    try {
      const result = await resultApi.submit({
        careerId: career._id,
        taskScore,
        quizScore,
        gameScore
      });
      sessionStorage.setItem("tac_latest_result", JSON.stringify(result));
      router.push("/result");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !career || !trial || !currentStep) {
    return (
      <ProtectedRoute>
        <PageShell>
          <p className="text-muted-foreground">Loading trial...</p>
        </PageShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageShell className="space-y-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-emerald-400/15">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-2xl">{career.title} Trial</CardTitle>
              <Badge variant="secondary">Day {currentDay} of {totalDays}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete each day to unlock your TAC compatibility report.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Progress value={progressPercent} />
            <div className="grid gap-2 sm:grid-cols-5">
              {trial.tasks.map((step) => {
                const completed = completedDays.includes(step.day);
                const active = step.day === currentDay;
                return (
                  <button
                    key={step.day}
                    type="button"
                    onClick={() => setCurrentDay(step.day)}
                    className={cn(
                      "rounded-xl border p-3 text-left text-sm",
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card/60",
                      completed && "border-emerald-500/40 bg-emerald-500/10"
                    )}
                  >
                    <p className="font-semibold">Day {step.day}</p>
                    <p className="capitalize text-muted-foreground">{step.type}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              {currentStep.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {currentStep.content}
            </p>

            {(currentStep.resources ?? []).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Module Resources
                </p>
                <div className="grid gap-2">
                  {currentStep.resources?.map((resource) => (
                    <a
                      key={`${resource.url}-${resource.label}`}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/50 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span>{resource.label}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {currentStep.type === "task" && (
              <Textarea
                value={taskResponse}
                onChange={(event) => setTaskResponse(event.target.value)}
                placeholder="Write how you would approach this task..."
              />
            )}

            {currentStep.type === "quiz" && (
              <div className="space-y-2">
                {(currentStep.options ?? []).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setQuizChoice(option)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left text-sm",
                      quizChoice === option
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card/60"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentStep.type === "project" && (
              <Textarea
                value={projectResponse}
                onChange={(event) => setProjectResponse(event.target.value)}
                placeholder="Outline your mini-project approach..."
              />
            )}

            {currentStep.type === "game" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  Complete both mini-games and save your combined score.
                </div>
                <TrialGameStage
                  careerSlug={career.slug}
                  onComplete={(score) => {
                    setGameScore(score);
                    setFeedback(`Mini-game score saved: ${score}%`);
                  }}
                />
              </div>
            )}

            {feedback && (
              <p className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3 text-sm">
                {feedback}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={completeCurrentDay} disabled={saving}>
                {saving ? "Saving..." : `Complete Day ${currentDay}`}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" />
              Trial Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-sm text-muted-foreground">Task Score</p>
              <p className="text-2xl font-bold">{taskScore}%</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-sm text-muted-foreground">Quiz Score</p>
              <p className="text-2xl font-bold">{quizScore}%</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-sm text-muted-foreground">Game Score</p>
              <p className="text-2xl font-bold">{gameScore}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm text-muted-foreground">
              Complete all five days, then generate your compatibility report.
            </p>
            <Button
              onClick={submitResult}
              disabled={completedDays.length < totalDays || submitting}
              size="lg"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {submitting ? "Generating Report..." : "Generate Career Report"}
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    </ProtectedRoute>
  );
}

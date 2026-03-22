"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Flag, Gamepad2, ListChecks } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { TrialGameStage } from "@/components/trial-game-stage";
import { trialApi, resultApi } from "@/lib/api";
import { Career, Trial, TrialStep } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const MIN_ASSIGNMENT_RESPONSE = 20;

const normalizeResourceUrl = (rawUrl: string): string => {
  try {
    const parsed = new URL(rawUrl);
    const isGoogleSearchRedirect =
      parsed.hostname.includes("google.") && parsed.pathname === "/search";

    if (isGoogleSearchRedirect) {
      const target = parsed.searchParams.get("q");
      if (target && /^https?:\/\//i.test(target)) {
        return target;
      }
    }

    return parsed.toString();
  } catch {
    return rawUrl;
  }
};

const toYouTubeEmbedUrl = (rawUrl: string): string | null => {
  const normalized = normalizeResourceUrl(rawUrl);

  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./, "");

    const toEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? toEmbed(id) : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        return id ? toEmbed(id) : null;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        return id ? toEmbed(id) : null;
      }

      const id = parsed.searchParams.get("v");
      return id ? toEmbed(id) : null;
    }

    return null;
  } catch {
    return null;
  }
};

const getCompletionScore = (completedCount: number, totalCount: number): number => {
  if (totalCount <= 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
};

export default function TrialPage() {
  const params = useParams<{ career: string }>();
  const router = useRouter();

  const [career, setCareer] = useState<Career | null>(null);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [taskScore, setTaskScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [completedGameModules, setCompletedGameModules] = useState<number[]>([]);
  const [moduleResponses, setModuleResponses] = useState<Record<number, string>>({});
  const [quizChoices, setQuizChoices] = useState<Record<number, string>>({});
  const [moduleFeedback, setModuleFeedback] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingModule, setSavingModule] = useState<number | null>(null);
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

  const modules = useMemo(() => {
    return [...(trial?.tasks ?? [])].sort((a, b) => a.day - b.day);
  }, [trial]);

  const totalModules = modules.length;
  const progressPercent =
    totalModules === 0 ? 0 : Math.round((completedDays.length / totalModules) * 100);

  const pushModuleFeedback = (moduleDay: number, message: string) => {
    setModuleFeedback((prev) => ({
      ...prev,
      [moduleDay]: message
    }));
  };

  const persistProgress = async ({
    nextCompleted,
    nextTaskScore,
    nextQuizScore,
    nextGameScore
  }: {
    nextCompleted: number[];
    nextTaskScore: number;
    nextQuizScore: number;
    nextGameScore: number;
  }) => {
    if (!params.career) return;

    const nextModuleDay =
      modules.find((step) => !nextCompleted.includes(step.day))?.day ?? totalModules;

    await trialApi.saveProgress(params.career, {
      currentDay: nextModuleDay,
      completedDays: nextCompleted,
      taskScore: nextTaskScore,
      quizScore: nextQuizScore,
      gameScore: nextGameScore,
      status: nextCompleted.length >= totalModules ? "completed" : "in_progress"
    });
  };

  const completeModule = async (moduleStep: TrialStep) => {
    if (completedDays.includes(moduleStep.day)) {
      pushModuleFeedback(moduleStep.day, "This module is already completed.");
      return;
    }

    if (moduleStep.type === "quiz") {
      const selectedChoice = quizChoices[moduleStep.day];
      if (!selectedChoice) {
        pushModuleFeedback(moduleStep.day, "Choose an answer before completing.");
        return;
      }
    }

    if (moduleStep.type === "game" && !completedGameModules.includes(moduleStep.day)) {
      pushModuleFeedback(
        moduleStep.day,
        "Finish the interactive activity and save score before completing this module."
      );
      return;
    }

    const response = (moduleResponses[moduleStep.day] ?? "").trim();
    if (moduleStep.assignment && response.length < MIN_ASSIGNMENT_RESPONSE) {
      pushModuleFeedback(
        moduleStep.day,
        `Add at least ${MIN_ASSIGNMENT_RESPONSE} characters for your module submission.`
      );
      return;
    }

    setSavingModule(moduleStep.day);

    try {
      const nextCompleted = Array.from(
        new Set([...completedDays, moduleStep.day])
      ).sort((a, b) => a - b);
      const completionScore = getCompletionScore(nextCompleted.length, totalModules);

      const nextTaskScore = completionScore;
      const nextQuizScore =
        moduleStep.type === "quiz" && quizChoices[moduleStep.day] === moduleStep.answer
          ? Math.max(completionScore, 95)
          : completionScore;
      const nextGameScore =
        moduleStep.type === "game"
          ? Math.max(completionScore, gameScore)
          : completionScore;

      setCompletedDays(nextCompleted);
      setTaskScore(nextTaskScore);
      setQuizScore(nextQuizScore);
      setGameScore(nextGameScore);

      await persistProgress({
        nextCompleted,
        nextTaskScore,
        nextQuizScore,
        nextGameScore
      });

      pushModuleFeedback(moduleStep.day, "Module completed successfully.");
    } finally {
      setSavingModule(null);
    }
  };

  const submitResult = async () => {
    if (!career || completedDays.length < totalModules) return;

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

  if (loading || !career || !trial) {
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
              <Badge variant="secondary">
                {completedDays.length}/{totalModules} Modules Completed
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Module-based learning path with videos and assignment submission in each module.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Progress value={progressPercent} />
            <div className="grid gap-2 sm:grid-cols-5">
              {modules.map((moduleStep) => {
                const completed = completedDays.includes(moduleStep.day);
                return (
                  <div
                    key={moduleStep.day}
                    className={cn(
                      "rounded-xl border p-3 text-left text-sm",
                      completed
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-border bg-card/60"
                    )}
                  >
                    <p className="font-semibold">Module {moduleStep.day}</p>
                    <p className="text-muted-foreground">
                      {completed ? "Completed" : "Pending"}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {modules.map((moduleStep) => {
            const completed = completedDays.includes(moduleStep.day);
            const isSavingThisModule = savingModule === moduleStep.day;

            return (
              <Card
                key={moduleStep.day}
                className={cn(completed && "border-emerald-500/40 bg-emerald-500/5")}
              >
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ListChecks className="h-5 w-5 text-primary" />
                      {moduleStep.title}
                    </CardTitle>
                    <Badge variant={completed ? "default" : "secondary"}>
                      {completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {moduleStep.content}
                  </p>

                  {moduleStep.assignment && (
                    <div className="rounded-xl border border-primary/25 bg-primary/5 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Assigned Task
                      </p>
                      <p className="mt-1 text-sm">{moduleStep.assignment}</p>
                    </div>
                  )}

                  {(moduleStep.resources ?? []).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Module Videos
                      </p>
                      <div className="grid gap-2">
                        {moduleStep.resources?.map((resource) => {
                          const sourceUrl = normalizeResourceUrl(resource.url);
                          const embedUrl = toYouTubeEmbedUrl(resource.url);

                          return (
                            <div
                              key={`${resource.url}-${resource.label}`}
                              className="space-y-2 rounded-xl border border-border/80 bg-card/50 p-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-medium">{resource.label}</p>
                                <a
                                  href={sourceUrl}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                  Open source
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </div>

                              {embedUrl ? (
                                <div className="overflow-hidden rounded-lg border border-border/70 bg-black">
                                  <div className="aspect-video w-full">
                                    <iframe
                                      src={embedUrl}
                                      title={resource.label}
                                      className="h-full w-full"
                                      loading="lazy"
                                      referrerPolicy="strict-origin-when-cross-origin"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  Inline playback is unavailable for this resource.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {moduleStep.type === "quiz" && (moduleStep.options ?? []).length > 0 && (
                    <div className="space-y-2">
                      {(moduleStep.options ?? []).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setQuizChoices((prev) => ({
                              ...prev,
                              [moduleStep.day]: option
                            }))
                          }
                          className={cn(
                            "w-full rounded-xl border p-3 text-left text-sm",
                            quizChoices[moduleStep.day] === option
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card/60"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {moduleStep.type === "game" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                        Complete this activity, then click complete module.
                      </div>
                      <TrialGameStage
                        careerSlug={career.slug}
                        onComplete={(score) => {
                          setGameScore(score);
                          setCompletedGameModules((prev) =>
                            prev.includes(moduleStep.day) ? prev : [...prev, moduleStep.day]
                          );
                          pushModuleFeedback(
                            moduleStep.day,
                            `Activity score saved: ${score}%. You can complete this module now.`
                          );
                        }}
                      />
                    </div>
                  )}

                  {moduleStep.assignment && (
                    <Textarea
                      value={moduleResponses[moduleStep.day] ?? ""}
                      onChange={(event) =>
                        setModuleResponses((prev) => ({
                          ...prev,
                          [moduleStep.day]: event.target.value
                        }))
                      }
                      placeholder="Write your assignment response for this module..."
                    />
                  )}

                  {moduleFeedback[moduleStep.day] && (
                    <p className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3 text-sm">
                      {moduleFeedback[moduleStep.day]}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => void completeModule(moduleStep)}
                      disabled={completed || (savingModule !== null && !isSavingThisModule)}
                    >
                      {completed
                        ? "Module Completed"
                        : isSavingThisModule
                          ? "Saving..."
                          : "Complete This Module"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
              Complete all modules, then generate your compatibility report.
            </p>
            <Button
              onClick={submitResult}
              disabled={completedDays.length < totalModules || submitting}
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

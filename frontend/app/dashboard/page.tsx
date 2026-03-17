"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  ArrowRight,
  BadgeCheck,
  Gamepad2,
  GraduationCap,
  Target,
  Trophy
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";
import { resultApi } from "@/lib/api";
import { CompatibilityResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getUserCertificates,
  getUserCourseProgressMap,
  getUserGameScores
} from "@/lib/learning-store";

type PopulatedCareer = {
  _id: string;
  title: string;
  slug: string;
};

type DashboardResult = Omit<CompatibilityResult, "careerId" | "careerTitle"> & {
  careerId: string | PopulatedCareer | null;
  careerTitle?: string;
};

const isPopulatedCareer = (value: unknown): value is PopulatedCareer => {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    typeof (value as { title?: unknown }).title === "string"
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<DashboardResult[]>([]);
  const [gamePoints, setGamePoints] = useState(0);
  const [courseCompletion, setCourseCompletion] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultApi
      .listMine()
      .then((items) => setResults(items as DashboardResult[]))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const gameScores = getUserGameScores(user.id);
    const progressMap = getUserCourseProgressMap(user.id);
    const certificates = getUserCertificates(user.id);

    const totalGamePoints = Object.values(gameScores).reduce(
      (total, score) => total + score.bestScore,
      0
    );

    const averageCourseProgress =
      Object.values(progressMap).length === 0
        ? 0
        : Math.round(
            Object.values(progressMap).reduce(
              (total, progress) => total + progress.percentComplete,
              0
            ) / Object.values(progressMap).length
          );

    setGamePoints(totalGamePoints);
    setCourseCompletion(averageCourseProgress);
    setCertificateCount(certificates.length);
  }, [user?.id]);

  const latestResult = results[0];

  const chartData = useMemo(() => {
    return [...results]
      .reverse()
      .slice(0, 8)
      .map((item, index) => {
        const careerTitle = isPopulatedCareer(item.careerId)
          ? item.careerId.title
          : item.careerTitle ?? `Career ${index + 1}`;
        return {
          index: index + 1,
          career: careerTitle,
          fitScore: item.score,
          task: item.breakdown.taskScore,
          quiz: item.breakdown.quizScore,
          game: item.breakdown.gameScore
        };
      });
  }, [results]);

  const scoreMeterData = useMemo(
    () => [
      { name: "Avg Course Progress", value: courseCompletion, color: "#0ea5e9" },
      { name: "Remaining", value: Math.max(0, 100 - courseCompletion), color: "#e2e8f0" }
    ],
    [courseCompletion]
  );

  return (
    <ProtectedRoute>
      <PageShell className="space-y-6">
        <section className="rounded-3xl border border-border/60 bg-card/70 p-7">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-heading text-3xl font-bold">{user?.name}</h1>
          <p className="mt-1 text-muted-foreground">
            Track your completed career trials and compatibility insights.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Start New Trial
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Take a new career simulation to widen your profile and unlock more suggestions.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-border/70 bg-card/60 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Why Start Now
                </p>
                <p className="text-sm text-muted-foreground">
                  Build stronger confidence by comparing multiple career trial outcomes.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-border/70 bg-card/60 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Next Step
                </p>
                <p className="text-sm text-muted-foreground">
                  Complete one more 5-day simulation to improve recommendation accuracy.
                </p>
              </div>
              <Button asChild className="w-full sm:col-span-2" size="lg">
                <Link href="/careers">
                  Explore Careers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Career Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(latestResult?.suggestedCareers ?? []).length > 0 ? (
                  (latestResult?.suggestedCareers ?? []).map((career) => (
                    <Badge key={career} variant="secondary">
                      {career}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete a trial to unlock personalized suggestions.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Completed Trials
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold">{results.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Latest Fit Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold">{latestResult?.score ?? 0}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Strongest Area
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-lg font-semibold">
                {latestResult?.strengths?.[0] ?? "Start a trial"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Next Best Match
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-lg font-semibold">
                {latestResult?.suggestedCareers?.[0] ?? "Data pending"}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Career Fit Progress</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
                  <XAxis dataKey="index" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="fitScore"
                    stroke="#06b6d4"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Latest Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Task", score: latestResult?.breakdown.taskScore ?? 0 },
                    { name: "Quiz", score: latestResult?.breakdown.quizScore ?? 0 },
                    { name: "Game", score: latestResult?.breakdown.gameScore ?? 0 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                Game Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{gamePoints}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Best score points earned in Game Zone
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="/game-zone">Play More Games</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreMeterData}
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {scoreMeterData.map((segment) => (
                      <Cell key={segment.name} fill={segment.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="mt-2 text-center text-sm font-semibold">{courseCompletion}% Avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-primary" />
                Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{certificateCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Verified certificates generated
              </p>
              <Button asChild className="mt-4 w-full" variant="outline">
                <Link href="/certificates">Open Certificates</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {loading && <p className="text-sm text-muted-foreground">Loading data...</p>}
      </PageShell>
    </ProtectedRoute>
  );
}

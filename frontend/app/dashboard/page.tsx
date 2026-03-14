"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ArrowRight, Target, Trophy } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";
import { resultApi } from "@/lib/api";
import { CompatibilityResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultApi
      .listMine()
      .then((items) => setResults(items as DashboardResult[]))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Career Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Start New Trial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Try another profession simulation and expand your profile.
              </p>
              <Button asChild className="w-full">
                <Link href="/careers">
                  Explore Careers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {loading && <p className="text-sm text-muted-foreground">Loading data...</p>}
      </PageShell>
    </ProtectedRoute>
  );
}

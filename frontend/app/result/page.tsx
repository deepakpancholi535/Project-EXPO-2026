"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ArrowRight, Award, TrendingUp } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { resultApi } from "@/lib/api";
import { CompatibilityResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const scoreColors = ["#06b6d4", "#f59e0b"];

export default function ResultPage() {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem("tac_latest_result");
    if (cached) {
      setResult(JSON.parse(cached) as CompatibilityResult);
      setLoading(false);
      return;
    }

    resultApi
      .latest()
      .then((latest) => setResult(latest))
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, []);

  const pieData = useMemo(
    () => [
      { name: "Fit Score", value: result?.score ?? 0 },
      { name: "Gap", value: 100 - (result?.score ?? 0) }
    ],
    [result]
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <PageShell>
          <p className="text-muted-foreground">Loading your report...</p>
        </PageShell>
      </ProtectedRoute>
    );
  }

  if (!result) {
    return (
      <ProtectedRoute>
        <PageShell className="space-y-4">
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            No result found yet. Complete a trial first.
          </p>
          <Button asChild>
            <Link href="/careers">Go to Careers</Link>
          </Button>
        </PageShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageShell className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-400/20 to-cyan-500/20">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="h-6 w-6 text-primary" />
              Career Compatibility Report
            </CardTitle>
            <p className="text-muted-foreground">
              Final fit score based on task, quiz, and game performance.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-3">
              <p className="font-heading text-5xl font-bold">{result.score}%</p>
              <Badge variant="success" className="mb-1">
                Career Fit Score
              </Badge>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Compatibility Meter</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={68}
                    outerRadius={108}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={scoreColors[index % scoreColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Task", score: result.breakdown.taskScore },
                    { name: "Quiz", score: result.breakdown.quizScore },
                    { name: "Game", score: result.breakdown.gameScore }
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#06b6d4" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.strengths.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weaknesses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.weakness.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Next Careers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.suggestedCareers.map((item) => (
                <Badge key={item} variant="secondary" className="mr-2">
                  {item}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard">
              View Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/careers">Try Another Career</Link>
          </Button>
        </section>
      </PageShell>
    </ProtectedRoute>
  );
}

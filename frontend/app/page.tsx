import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesCombined,
  GraduationCap,
  ShieldCheck,
  Trophy
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Active Learners", value: "12,400+" },
  { label: "Courses", value: "140+" },
  { label: "Certificates Issued", value: "5,300+" }
];

const features = [
  {
    title: "Curated Learning Paths",
    description:
      "High-quality module sequencing with practical assignments and progress checkpoints.",
    icon: GraduationCap
  },
  {
    title: "Game-Based Reinforcement",
    description:
      "Interactive coding mini-games to improve retention through focused, repeatable loops.",
    icon: BrainCircuit
  },
  {
    title: "Performance Ranking",
    description:
      "Track your momentum with program-wise and overall leaderboards.",
    icon: Trophy
  },
  {
    title: "Verified Outcome Layer",
    description:
      "Generate QR-verified completion certificates ready for portfolio and profile sharing.",
    icon: ShieldCheck
  }
];

export default function HomePage() {
  return (
    <PageShell className="space-y-10 py-8 md:py-10">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-black/5 bg-white/80 p-7 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65 md:p-12">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl dark:bg-blue-600/20" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/15" />

        <div className="relative space-y-7">
          <Badge variant="secondary" className="px-3 py-1">
            Premium Learning Experience
          </Badge>

          <div className="space-y-4">
            <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Learn, Practice, and Prove Your Skills with a Premium Flow.
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Try Any Career blends structured courses, gamified learning, leaderboard
              momentum, and verified certification into one clean, high-performance platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-black/5 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/60"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="h-full border-black/5 dark:border-white/10">
              <CardHeader>
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-black/5 dark:border-white/10">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Course Studio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Navigate module-based content with high clarity, consistent pacing,
              and measurable milestones.
            </p>
            <Button asChild className="w-full">
              <Link href="/courses">Open Courses</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-black/5 dark:border-white/10">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ChartNoAxesCombined className="h-5 w-5 text-primary" />
              Leaderboard Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Compare progress across tracks and maintain competitive motivation
              with meaningful points.
            </p>
            <Button asChild className="w-full">
              <Link href="/leaderboards">View Rankings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-black/5 dark:border-white/10">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Game Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Reinforce concepts through short game loops designed for practical
              application and memory.
            </p>
            <Button asChild className="w-full">
              <Link href="/game-zone">Enter Game Zone</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}


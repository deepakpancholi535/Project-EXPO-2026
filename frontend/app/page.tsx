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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Course-Based Learning Paths",
    description:
      "Structured modules with lectures, assignments, and progress tracking.",
    icon: GraduationCap
  },
  {
    title: "Game Zone Gamification",
    description:
      "Programming concept games with score history and challenge loops.",
    icon: BrainCircuit
  },
  {
    title: "Track-Based Leaderboards",
    description:
      "Compete in Programming, Web Development, Data Structures, and Overall rankings.",
    icon: Trophy
  },
  {
    title: "Verified Certificates",
    description:
      "Generate certificates with unique IDs and QR verification after completion.",
    icon: ShieldCheck
  }
];

export default function HomePage() {
  return (
    <PageShell className="space-y-12 py-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-cyan-500/20 via-white/30 to-orange-400/15 p-8 shadow-2xl backdrop-blur md:p-14">
        <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-16 left-8 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="relative space-y-6">
          <Badge variant="success" className="px-3 py-1 text-xs">
            Course + Gamification Learning Platform
          </Badge>
          <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl">
            Learn, Play, Rank, and Get Certified.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            TAC Learn combines structured courses, interactive coding games,
            leaderboard motivation, and verifiable certificates in one platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Structured Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Start with guided modules, watch lectures, and submit assignments with deadlines.
            </p>
            <Button asChild className="w-full">
              <Link href="/courses">Go to Courses</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ChartNoAxesCombined className="h-5 w-5 text-primary" />
              Leaderboard Motivation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Build momentum through points and rankings by track and overall progress.
            </p>
            <Button asChild className="w-full">
              <Link href="/leaderboards">View Leaderboards</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Game Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Practice concepts in fast game loops and improve your best scores.
            </p>
            <Button asChild className="w-full">
              <Link href="/game-zone">Play Games</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}

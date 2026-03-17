import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesCombined,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Trophy
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featureCards = [
  {
    title: "Course Intelligence",
    description:
      "Structured modules, progression checkpoints, and assignment-driven learning flow.",
    icon: GraduationCap
  },
  {
    title: "Game-Based Practice",
    description:
      "Concept games with score memory and fast challenge loops for deeper retention.",
    icon: BrainCircuit
  },
  {
    title: "Competitive Leaderboards",
    description:
      "Program-wise and overall rankings that reward consistent skill growth.",
    icon: Trophy
  },
  {
    title: "Trusted Certification",
    description:
      "Generate unique certificates with QR verification for credible proof of completion.",
    icon: ShieldCheck
  }
];

const performanceStats = [
  { label: "Active Learners", value: "12K+" },
  { label: "Skill Games", value: "30+" },
  { label: "Issued Certificates", value: "5.4K" }
];

export default function HomePage() {
  return (
    <PageShell className="space-y-12 py-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-7 text-white shadow-2xl md:p-12">
        <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-cyan-500/35 blur-3xl" />
        <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Badge className="border-cyan-400/35 bg-cyan-400/20 px-4 py-1 text-cyan-100">
              Next-Gen Learning Experience
            </Badge>
            <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Build Skills Through Courses, Games, and Career-Level Proof.
            </h1>
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
              TAC combines premium course design, gamified learning loops, and
              verified certificates into one high-performance growth platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>

          <Card className="border-slate-700/70 bg-slate-900/85 text-slate-100">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-2xl">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                Learning Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {performanceStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-700 bg-slate-800/65 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-cyan-300">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="h-full border-border/70 bg-card/92">
              <CardHeader className="space-y-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
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
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Course Studio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Follow structured modules with video navigation, progress checkpoints,
              and assignment milestones.
            </p>
            <Button asChild className="w-full">
              <Link href="/courses">Open Courses</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ChartNoAxesCombined className="h-5 w-5 text-primary" />
              Ranking Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Track momentum through real-time points and leaderboard movement
              across focused learning tracks.
            </p>
            <Button asChild className="w-full">
              <Link href="/leaderboards">See Leaderboards</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Game Arena
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Reinforce learning with short, intense mini-games designed for practical skill transfer.
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


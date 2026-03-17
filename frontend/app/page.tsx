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

const quickStats = [
  { label: "Active Learners", value: "12.4K" },
  { label: "Programs", value: "140+" },
  { label: "Certifications", value: "5.3K" }
];

const bentoItems = [
  {
    title: "Course Studio",
    description:
      "Modular curriculum with clear progression, deadlines, and assignment flow.",
    icon: GraduationCap,
    cta: { href: "/courses", label: "Explore Courses" },
    className: "lg:col-span-2"
  },
  {
    title: "Game Zone",
    description:
      "Skill drills, memory loops, and repeatable game mechanics for real retention.",
    icon: BrainCircuit,
    cta: { href: "/game-zone", label: "Play Challenges" },
    className: "lg:col-span-1"
  },
  {
    title: "Leaderboards",
    description:
      "Track your rank across focused pathways and overall performance.",
    icon: Trophy,
    cta: { href: "/leaderboards", label: "View Rankings" },
    className: "lg:col-span-1"
  },
  {
    title: "Verified Certificates",
    description:
      "Generate QR-secured outcome proof ready for profile and portfolio sharing.",
    icon: ShieldCheck,
    cta: { href: "/certificates", label: "See Certificates" },
    className: "lg:col-span-2"
  }
];

export default function HomePage() {
  return (
    <PageShell className="space-y-10 py-8 md:py-10">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-black/5 bg-white/75 p-7 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 md:p-10">
        <div className="grid-noise absolute inset-0 opacity-40 dark:opacity-20" />
        <div className="drift-slow absolute -left-24 top-0 h-60 w-60 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="float-slow absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl dark:bg-blue-500/20" />

        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-7">
            <Badge variant="secondary" className="px-3 py-1">
              Creative Learning OS
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-4xl font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Design Your Career Path Like a Product, Not a Checklist.
              </h1>
              <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
                Try Any Career fuses course depth, game repetition, competitive
                momentum, and verified outcomes into one creative growth workflow.
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
                <Link href="/courses">Browse Programs</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/5 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/65"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="rotate-[-2deg] border-black/5 bg-white/85 dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Learning Pulse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-black/5 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-900/75">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Weekly Growth
                  </p>
                  <p className="mt-1 text-lg font-semibold">+18% Skill Progress</p>
                </div>
                <div className="rounded-xl border border-black/5 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-900/75">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Live Streak
                  </p>
                  <p className="mt-1 text-lg font-semibold">7 Day Consistency</p>
                </div>
              </CardContent>
            </Card>

            <Card className="translate-x-4 rotate-[1.5deg] border-black/5 bg-black text-white dark:border-white/10">
              <CardContent className="p-5">
                <p className="text-sm text-white/70">Build fast, stay consistent, prove outcomes.</p>
                <p className="mt-2 text-2xl font-semibold">From learning to leaderboard to certificate.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {bentoItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className={`border-black/5 dark:border-white/10 ${item.className}`}
            >
              <CardHeader className="space-y-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <Button asChild variant="secondary">
                  <Link href={item.cta.href}>
                    {item.cta.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="rounded-3xl border border-black/5 bg-white/75 p-6 dark:border-white/10 dark:bg-slate-900/65 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Product Philosophy
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold">
              Learn with clarity. Practice with pressure. Prove with confidence.
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href="/signup">
              Join the Platform
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}


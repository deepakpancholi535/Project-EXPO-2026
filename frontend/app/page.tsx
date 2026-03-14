import Link from "next/link";
import { ArrowRight, Brain, Compass, Sparkles, Target } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Interactive Career Simulations",
    description:
      "Try real-world tasks from Software Engineering, Data Analytics, and UI/UX.",
    icon: Compass
  },
  {
    title: "Mini-Games with Scoring",
    description:
      "Measure practical ability through fast challenge loops built for students.",
    icon: Brain
  },
  {
    title: "Compatibility Reports",
    description:
      "Get strengths, weaknesses, and fit score before investing in a career path.",
    icon: Target
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
            Student Career Discovery Platform
          </Badge>
          <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl">
            Try Any Career Before You Commit.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            TAC helps students experience real tasks from different careers
            through short lessons, simulations, and mini-games.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start For Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/careers">Explore Careers</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
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

      <section className="rounded-3xl border border-border/70 bg-card/70 p-8 text-center">
        <Sparkles className="mx-auto mb-3 h-7 w-7 text-primary" />
        <h2 className="font-heading text-3xl font-bold">Modern Trial Journey</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Signup, start a 5-day structured career trial, complete games and quizzes,
          and instantly view your personalized compatibility dashboard.
        </p>
      </section>
    </PageShell>
  );
}

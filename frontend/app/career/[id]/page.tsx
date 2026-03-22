"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, CircleCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { trialApi } from "@/lib/api";
import { Career, Trial } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CareerDetailPage() {
  const params = useParams<{ id: string }>();
  const [career, setCareer] = useState<Career | null>(null);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    trialApi
      .getTrialByCareer(params.id)
      .then((payload) => {
        setCareer(payload.career);
        setTrial(payload.trial);
      })
      .catch(() => setError("Career details are unavailable right now."))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <PageShell>
        <p className="text-muted-foreground">Loading career details...</p>
      </PageShell>
    );
  }

  if (!career) {
    return (
      <PageShell>
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          {error || "Career not found"}
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-500/15 to-orange-400/15">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-3xl">{career.title}</CardTitle>
            <Badge variant="secondary">{career.difficulty}</Badge>
          </div>
          <p className="text-muted-foreground">{career.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="font-heading text-xl font-bold">Module-Based Trial Journey</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {(trial?.tasks ?? []).map((moduleStep) => (
              <div
                key={moduleStep.day}
                className="flex items-center gap-2 rounded-xl border border-border bg-card/50 p-3 text-sm"
              >
                <CircleCheck className="h-4 w-4 text-primary" />
                {moduleStep.title}
              </div>
            ))}
            {!trial?.tasks?.length && (
              <div className="rounded-xl border border-border bg-card/50 p-3 text-sm text-muted-foreground">
                Modules are being prepared for this trial.
              </div>
            )}
          </div>
          <Button asChild size="lg">
            <Link href={`/trial/${career.slug}`}>
              Start {career.title} Modules
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CareerCard } from "@/components/career-card";
import { careerApi } from "@/lib/api";
import { Career } from "@/lib/types";

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    careerApi
      .list()
      .then((items) => setCareers(items))
      .catch(() => setError("Unable to load careers right now."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell className="space-y-8">
      <section className="rounded-3xl border border-border/60 bg-card/70 p-7">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-bold">Career Explorer</h1>
            <p className="text-muted-foreground">
              Try short, realistic career experiences before making a decision.
            </p>
          </div>
        </div>
      </section>

      {loading && <p className="text-muted-foreground">Loading careers...</p>}
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {careers.map((career) => (
          <CareerCard key={career._id} career={career} />
        ))}
      </section>
    </PageShell>
  );
}

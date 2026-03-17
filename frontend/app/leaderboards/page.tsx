"use client";

import { useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";
import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  leaderboardLabels,
  type LeaderboardTrack
} from "@/lib/learning-content";
import { buildLeaderboardTable } from "@/lib/leaderboards";

const tabs: LeaderboardTrack[] = [
  "programming",
  "web-development",
  "data-structures",
  "overall"
];

export default function LeaderboardsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LeaderboardTrack>("programming");

  const table = useMemo(
    () =>
      buildLeaderboardTable(
        activeTab,
        user ? { id: user.id, name: user.name } : undefined
      ),
    [activeTab, user]
  );

  return (
    <ProtectedRoute>
      <PageShell className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/70 p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Community Rankings</p>
              <h1 className="font-heading text-4xl font-bold">Leaderboards</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Compare points across course completion and game performance by track.
                Hover over initials to view learner details and profile quick links.
              </p>
            </div>
            <Badge variant="success" className="inline-flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Updated Live
            </Badge>
          </div>
        </section>

        <section className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
            >
              {leaderboardLabels[tab].replace(" Leaderboard", "")}
            </Button>
          ))}
        </section>

        <div className="overflow-x-auto">
          <div className="min-w-[740px]">
            <LeaderboardTable
              title={leaderboardLabels[activeTab]}
              rows={table.rows}
              hoverProfiles={table.hoverProfiles}
            />
          </div>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}


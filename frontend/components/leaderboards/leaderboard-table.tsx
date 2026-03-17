import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { UserHoverCard } from "@/components/user-hover-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HoverCardProfile, LeaderboardRow } from "@/lib/leaderboards";

interface LeaderboardTableProps {
  title: string;
  rows: LeaderboardRow[];
  hoverProfiles: Record<string, HoverCardProfile>;
}

export const LeaderboardTable = ({
  title,
  rows,
  hoverProfiles
}: LeaderboardTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-[72px_1fr_110px_130px] gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <p>Rank</p>
          <p>Name</p>
          <p className="text-right">Points</p>
          <p className="text-right">Profile</p>
        </div>

        {rows.map((row) => {
          const hoverData = hoverProfiles[row.id];
          return (
            <div
              key={row.id}
              className={cn(
                "grid items-center gap-2 rounded-2xl border border-border/60 p-3",
                "grid-cols-[72px_1fr_110px_130px]",
                row.isCurrentUser && "border-primary/40 bg-primary/5"
              )}
            >
              <p className="font-semibold">#{row.rank}</p>
              <div className="flex items-center gap-3">
                <UserHoverCard
                  initials={row.initials}
                  fullName={hoverData?.fullName ?? row.name}
                  programEnrolled={hoverData?.programEnrolled ?? row.programLabel}
                  points={hoverData?.points ?? row.points}
                  rank={hoverData?.rank ?? row.rank}
                  profileLink={hoverData?.profileLink ?? row.profileLink}
                />
                <div>
                  <p className="font-semibold">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.programLabel}</p>
                </div>
              </div>
              <p className="text-right font-semibold">{row.points}</p>
              <div className="text-right">
                <Link
                  href={row.profileLink}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  View
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};


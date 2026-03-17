"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  GraduationCap,
  Trophy,
  UserRound
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";
import { UserHoverCard } from "@/components/user-hover-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildLeaderboardTable } from "@/lib/leaderboards";
import {
  getUserCertificates,
  getUserCourseProgressMap,
  getUserGameScores
} from "@/lib/learning-store";

export default function ProfilePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [gamePoints, setGamePoints] = useState(0);
  const [courseCompletion, setCourseCompletion] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [overallRank, setOverallRank] = useState(1);

  useEffect(() => {
    if (!user?.id) return;
    const gameScores = getUserGameScores(user.id);
    const progressMap = getUserCourseProgressMap(user.id);
    const certificates = getUserCertificates(user.id);

    setGamePoints(
      Object.values(gameScores).reduce((total, item) => total + item.bestScore, 0)
    );
    setCertificateCount(certificates.length);
    setCourseCompletion(
      Object.values(progressMap).length
        ? Math.round(
            Object.values(progressMap).reduce(
              (total, item) => total + item.percentComplete,
              0
            ) / Object.values(progressMap).length
          )
        : 0
    );

    const leaderboard = buildLeaderboardTable("overall", {
      id: user.id,
      name: user.name
    });
    const currentUserRow = leaderboard.rows.find((item) => item.isCurrentUser);
    setOverallRank(currentUserRow?.rank ?? 1);
  }, [user?.id]);

  const initials = useMemo(() => {
    return (user?.name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [user?.name]);

  return (
    <ProtectedRoute>
      <PageShell className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-primary" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="pb-2">
              <UserHoverCard
                initials={initials || "U"}
                fullName={user?.name ?? "Student"}
                programEnrolled="Learning Platform Scholar"
                points={gamePoints}
                rank={overallRank}
                profileLink="/profile"
              />
            </div>
            <p>
              <span className="text-muted-foreground">Name:</span> {user?.name}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span> {user?.email}
            </p>
            <p>
              <span className="text-muted-foreground">Role:</span> {user?.role}
            </p>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Game Points
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="inline-flex items-center gap-2 text-2xl font-bold">
                <Trophy className="h-5 w-5 text-primary" />
                {gamePoints}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Course Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold">{courseCompletion}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Certificates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold">{certificateCount}</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Mentor Experience (Placeholder)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              UI-only booking flow for future release. Backend integration pending.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-border bg-card/60 p-4">
              <h3 className="font-semibold">Book Mentor Call</h3>
              <Input type="date" />
              <Input type="time" />
              <Button
                className="w-full"
                onClick={() => setMessage("Mentor call request captured (UI only).")}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Book Call
              </Button>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-card/60 p-4">
              <h3 className="font-semibold">Book Career Shadow Session</h3>
              <Input type="date" />
              <Input type="time" />
              <Button
                className="w-full"
                variant="secondary"
                onClick={() =>
                  setMessage("Career shadow request captured (UI only).")
                }
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Book Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {message && (
          <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm">
            {message}
          </p>
        )}
      </PageShell>
    </ProtectedRoute>
  );
}

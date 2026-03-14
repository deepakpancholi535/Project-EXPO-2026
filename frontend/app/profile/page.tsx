"use client";

import { useState } from "react";
import { CalendarClock, GraduationCap, UserRound } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

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

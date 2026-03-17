"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  BadgeCheck,
  BookOpenCheck,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Trophy,
  UserRound,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { PlatformLogo } from "@/components/branding/platform-logo";
import { UserHoverCard } from "@/components/user-hover-card";
import { buildLeaderboardTable } from "@/lib/leaderboards";

type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
};

const privateNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpenCheck },
  { href: "/game-zone", label: "Game Zone", icon: Gamepad2 },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/certificates", label: "Certificates", icon: BadgeCheck },
  { href: "/profile", label: "Profile", icon: UserRound }
];

const publicNavItems: Array<{ href: Route; label: string }> = [
  { href: "/courses", label: "Courses" },
  { href: "/game-zone", label: "Game Zone" },
  { href: "/leaderboards", label: "Leaderboards" }
];

export const AppNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const currentUserProfile = useMemo(() => {
    if (!user) return null;
    const leaderboard = buildLeaderboardTable("overall", {
      id: user.id,
      name: user.name
    });
    const row = leaderboard.rows.find((item) => item.isCurrentUser);
    if (!row) return null;
    const hoverData = leaderboard.hoverProfiles[row.id];
    if (!hoverData) return null;

    return {
      initials: row.initials,
      ...hoverData
    };
  }, [user]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <PlatformLogo />

        <nav className="hidden items-center gap-1 lg:flex">
          {isAuthenticated
            ? privateNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-black/5 text-foreground dark:bg-white/10"
                          : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })
            : publicNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-black/5 text-foreground dark:bg-white/10"
                          : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          ) : (
            <>
              {currentUserProfile && (
                <div className="hidden sm:block">
                  <UserHoverCard
                    initials={currentUserProfile.initials}
                    fullName={currentUserProfile.fullName}
                    programEnrolled={currentUserProfile.programEnrolled}
                    points={currentUserProfile.points}
                    rank={currentUserProfile.rank}
                    profileLink={currentUserProfile.profileLink}
                  />
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-black/5 px-4 pb-2 lg:hidden dark:border-white/10">
        <nav className="flex gap-2 overflow-x-auto py-2">
          {isAuthenticated
            ? privateNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={cn(
                        "inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium",
                        isActive
                          ? "bg-black/10 text-foreground dark:bg-white/10"
                          : "bg-white/65 text-muted-foreground dark:bg-slate-800/75"
                      )}
                    >
                      <Icon className="mr-1 h-3.5 w-3.5" />
                      {item.label}
                    </span>
                  </Link>
                );
              })
            : publicNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={cn(
                        "inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium",
                        isActive
                          ? "bg-black/10 text-foreground dark:bg-white/10"
                          : "bg-white/65 text-muted-foreground dark:bg-slate-800/75"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
        </nav>
      </div>
    </header>
  );
};

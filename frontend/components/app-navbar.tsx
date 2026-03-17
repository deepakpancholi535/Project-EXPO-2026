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
  Medal,
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

const navItems: NavItem[] = [
  { href: "/courses", label: "Courses", icon: BookOpenCheck },
  { href: "/game-zone", label: "Game Zone", icon: Gamepad2 },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/careers", label: "Career Labs", icon: Medal },
  { href: "/certificates", label: "Certificates", icon: BadgeCheck },
  { href: "/profile", label: "Profile", icon: UserRound }
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
    <header className="sticky top-0 z-40 border-b border-white/20 bg-background/85 backdrop-blur-xl dark:border-white/10">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <PlatformLogo />

        <nav className="hidden items-center gap-2 md:flex">
          {isAuthenticated &&
            navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
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

      {isAuthenticated && (
        <div className="border-t border-border/60 px-4 py-2 md:hidden">
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "inline-flex whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold",
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-card/70 text-muted-foreground"
                    )}
                  >
                    <Icon className="mr-1 h-3.5 w-3.5" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

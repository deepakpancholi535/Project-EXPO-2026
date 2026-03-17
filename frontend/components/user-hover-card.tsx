"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserHoverCardProps {
  initials: string;
  fullName: string;
  programEnrolled: string;
  points: number;
  rank: number;
  profileLink: string;
  className?: string;
}

export const UserHoverCard = ({
  initials,
  fullName,
  programEnrolled,
  points,
  rank,
  profileLink,
  className
}: UserHoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/15 text-sm font-semibold text-cyan-800 transition-transform hover:scale-105 dark:text-cyan-100"
        aria-label={`View ${fullName} details`}
      >
        {initials}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-12 z-50 w-64 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur"
          >
            <p className="font-semibold">{fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{programEnrolled}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Points</dt>
              <dd className="text-right font-semibold">{points}</dd>
              <dt className="text-muted-foreground">Rank</dt>
              <dd className="text-right font-semibold">#{rank}</dd>
            </dl>
            <Link
              href={profileLink}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Open profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PlatformLogoProps {
  className?: string;
  compact?: boolean;
  href?: string;
}

export const PlatformLogo = ({
  className,
  compact = false,
  href = "/"
}: PlatformLogoProps) => {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/try-any-career-mark.svg"
        alt="Try Any Career logo mark"
        width={40}
        height={40}
        className="h-10 w-10"
        priority
      />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-heading text-lg font-semibold tracking-tight text-foreground">
            Try Any Career
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Learn • Play • Rank
          </span>
        </span>
      )}
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center"
      aria-label="Try Any Career home"
    >
      {content}
    </Link>
  );
};

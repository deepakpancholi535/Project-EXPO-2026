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
  const imageProps = compact
    ? {
        src: "/try-any-career-mark.svg",
        width: 40,
        height: 40,
        alt: "Try Any Career logo mark"
      }
    : {
        src: "/try-any-career-logo.svg",
        width: 280,
        height: 82,
        alt: "Try Any Career logo"
      };

  const content = (
    <Image
      src={imageProps.src}
      alt={imageProps.alt}
      width={imageProps.width}
      height={imageProps.height}
      className={cn(
        compact ? "h-10 w-10" : "h-10 w-auto max-w-[220px]",
        className
      )}
      priority
    />
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

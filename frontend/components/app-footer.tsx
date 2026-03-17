import Link from "next/link";
import type { Route } from "next";
import { Github, Linkedin, Mail, MessageSquare, Phone, Youtube } from "lucide-react";
import { PlatformLogo } from "@/components/branding/platform-logo";
import { learningCourses } from "@/lib/learning-content";

const quickLinks: Array<{ href: Route; label: string }> = [
  { href: "/courses", label: "Courses" },
  { href: "/game-zone", label: "Game Zone" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/dashboard", label: "Dashboard" }
];

const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: Github },
  { href: "https://www.linkedin.com", label: "LinkedIn", icon: Linkedin },
  { href: "https://www.youtube.com", label: "YouTube", icon: Youtube }
];

export const AppFooter = () => {
  return (
    <footer className="mt-12 border-t border-border/70 bg-white/60 backdrop-blur-sm dark:bg-card/30">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          <PlatformLogo href="/" className="h-14 w-auto" />
          <p className="max-w-md text-sm text-muted-foreground">
            TAC Learn is a modern course and gamification platform designed for
            students to build practical skills through guided modules, interactive
            games, and verified completion certificates.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted-foreground hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold">Courses</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {learningCourses.map((course) => (
              <li key={course.id}>
                <Link
                  href={`/courses/${course.id}` as Route}
                  className="text-muted-foreground hover:text-primary"
                >
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:tryanycareer@gmail.com" className="hover:text-primary">
                tryanycareer@gmail.com
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              +91 98765 43210
            </li>
          </ul>

          <a
            href="mailto:tryanycareer@gmail.com?subject=Feedback%20for%20Try%20Any%20Career&body=Hi%20Try%20Any%20Career%20team%2C%0A%0AMy%20feedback%20is%3A%0A"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            Send Feedback
          </a>

          <div className="mt-4 flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Copyright 2026 TAC Learn. Built for skill-first career growth.
        </p>
      </div>
    </footer>
  );
};

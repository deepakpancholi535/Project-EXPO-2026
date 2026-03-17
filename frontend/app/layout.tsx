import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppNavbar } from "@/components/app-navbar";
import { AppFooter } from "@/components/app-footer";

export const metadata: Metadata = {
  title: "TAC Learn - Course & Gamification Platform",
  description:
    "Build skills through course modules, programming games, leaderboard rankings, and verified certificates."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppNavbar />
          {children}
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}

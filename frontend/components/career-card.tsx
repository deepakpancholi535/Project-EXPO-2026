"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Code2, Palette } from "lucide-react";
import { Career } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, typeof Code2> = {
  Code2,
  LineChart: BarChart3,
  Palette
};

export const CareerCard = ({ career }: { career: Career }) => {
  const Icon = iconMap[career.icon] ?? Code2;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardHeader>
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <Badge variant="secondary">{career.difficulty}</Badge>
          </div>
          <CardTitle>{career.title}</CardTitle>
          <CardDescription>{career.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            5-day guided trial with tasks, mini-games, quiz, and project challenge.
          </p>
        </CardContent>
        <CardFooter className="justify-between">
          <Button asChild className="w-full">
            <Link href={`/career/${career._id}`}>
              Start Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

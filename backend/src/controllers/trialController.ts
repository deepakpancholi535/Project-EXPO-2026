import mongoose from "mongoose";
import { Request, Response } from "express";
import { Career } from "../models/Career";
import { Trial } from "../models/Trial";
import { Progress } from "../models/Progress";

const resolveCareer = async (careerRef: string) => {
  if (mongoose.Types.ObjectId.isValid(careerRef)) {
    const byId = await Career.findById(careerRef);
    if (byId) return byId;
  }

  return Career.findOne({ slug: careerRef });
};

export const getTrialByCareer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { career } = req.params;
  const careerDoc = await resolveCareer(career);

  if (!careerDoc) {
    res.status(404).json({ message: "Career not found" });
    return;
  }

  const trial = await Trial.findOne({ careerId: careerDoc._id });

  if (!trial) {
    res.status(404).json({ message: "Trial not found for this career" });
    return;
  }

  let progress = null;
  if (req.user) {
    progress = await Progress.findOne({
      userId: req.user.id,
      careerId: careerDoc._id
    });
  }

  res.json({
    career: careerDoc,
    trial,
    progress
  });
};

export const getMyProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { career } = req.params;
  const careerDoc = await resolveCareer(career);

  if (!careerDoc || !req.user) {
    res.status(404).json({ message: "Progress not found" });
    return;
  }

  const progress = await Progress.findOne({
    userId: req.user.id,
    careerId: careerDoc._id
  });

  if (!progress) {
    res.json({
      progress: {
        currentDay: 1,
        completedDays: [],
        taskScore: 0,
        quizScore: 0,
        gameScore: 0,
        status: "in_progress"
      }
    });
    return;
  }

  res.json({ progress });
};

export const saveProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { career } = req.params;
  const careerDoc = await resolveCareer(career);

  if (!careerDoc || !req.user) {
    res.status(404).json({ message: "Career not found" });
    return;
  }

  const {
    currentDay,
    completedDays,
    taskScore,
    quizScore,
    gameScore,
    status
  } = req.body as {
    currentDay?: number;
    completedDays?: number[];
    taskScore?: number;
    quizScore?: number;
    gameScore?: number;
    status?: "in_progress" | "completed";
  };

  const progress = await Progress.findOneAndUpdate(
    {
      userId: req.user.id,
      careerId: careerDoc._id
    },
    {
      $set: {
        currentDay: currentDay ?? 1,
        completedDays: completedDays ?? [],
        taskScore: taskScore ?? 0,
        quizScore: quizScore ?? 0,
        gameScore: gameScore ?? 0,
        status: status ?? "in_progress"
      }
    },
    { upsert: true, new: true }
  );

  res.json({ progress });
};

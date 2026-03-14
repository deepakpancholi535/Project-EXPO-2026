import mongoose from "mongoose";
import { Request, Response } from "express";
import { Career } from "../models/Career";
import { Progress } from "../models/Progress";
import { Result } from "../models/Result";
import { calculateCompatibility } from "../services/compatibilityService";

export const createResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { careerId, taskScore, quizScore, gameScore } = req.body as {
    careerId?: string;
    taskScore?: number;
    quizScore?: number;
    gameScore?: number;
  };

  if (!careerId) {
    res.status(400).json({ message: "careerId is required" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(careerId)) {
    res.status(400).json({ message: "Invalid careerId" });
    return;
  }

  const career = await Career.findById(careerId);
  if (!career) {
    res.status(404).json({ message: "Career not found" });
    return;
  }

  const task = taskScore ?? 0;
  const quiz = quizScore ?? 0;
  const game = gameScore ?? 0;

  const compatibility = calculateCompatibility({
    careerTitle: career.title,
    taskScore: task,
    quizScore: quiz,
    gameScore: game
  });

  const result = await Result.create({
    userId: req.user.id,
    careerId: career._id,
    score: compatibility.score,
    strengths: compatibility.strengths,
    weakness: compatibility.weakness,
    suggestedCareers: compatibility.suggestedCareers,
    breakdown: {
      taskScore: task,
      quizScore: quiz,
      gameScore: game
    }
  });

  await Progress.findOneAndUpdate(
    { userId: req.user.id, careerId: career._id },
    { status: "completed", currentDay: 5 },
    { new: true }
  );

  res.status(201).json({
    result: {
      id: result._id,
      careerId: career._id,
      careerTitle: career.title,
      score: result.score,
      strengths: result.strengths,
      weakness: result.weakness,
      breakdown: result.breakdown,
      suggestedCareers: result.suggestedCareers,
      createdAt: result.createdAt
    }
  });
};

export const getMyResults = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const results = await Result.find({ userId: req.user.id })
    .populate("careerId", "title slug difficulty")
    .sort({ createdAt: -1 });

  res.json({ results });
};

export const getMyLatestResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const latest = await Result.findOne({ userId: req.user.id })
    .populate("careerId", "title slug difficulty")
    .sort({ createdAt: -1 });

  if (!latest) {
    res.status(404).json({ message: "No results found" });
    return;
  }

  res.json({ result: latest });
};

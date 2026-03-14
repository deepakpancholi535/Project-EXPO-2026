import { Request, Response } from "express";
import { Career } from "../models/Career";
import { Trial } from "../models/Trial";

export const getCareers = async (_req: Request, res: Response): Promise<void> => {
  const careers = await Career.find().sort({ title: 1 });
  res.json({ careers });
};

export const getCareerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const career =
    (await Career.findById(id)) ?? (await Career.findOne({ slug: id }));

  if (!career) {
    res.status(404).json({ message: "Career not found" });
    return;
  }

  const trial = await Trial.findOne({ careerId: career._id });

  res.json({
    career,
    trialSummary: trial
      ? {
          totalDays: trial.tasks.length,
          stepTypes: trial.tasks.map((step) => step.type)
        }
      : null
  });
};

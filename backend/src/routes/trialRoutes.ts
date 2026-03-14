import { Router } from "express";
import {
  getMyProgress,
  getTrialByCareer,
  saveProgress
} from "../controllers/trialController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/:career", asyncHandler(getTrialByCareer));
router.get("/:career/progress", requireAuth, asyncHandler(getMyProgress));
router.post("/:career/progress", requireAuth, asyncHandler(saveProgress));

export default router;

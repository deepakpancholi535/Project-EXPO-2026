import { Router } from "express";
import {
  createResult,
  getMyLatestResult,
  getMyResults
} from "../controllers/resultController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", requireAuth, asyncHandler(getMyResults));
router.get("/latest", requireAuth, asyncHandler(getMyLatestResult));
router.post("/", requireAuth, asyncHandler(createResult));

export default router;

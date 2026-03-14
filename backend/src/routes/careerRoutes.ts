import { Router } from "express";
import { getCareerById, getCareers } from "../controllers/careerController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getCareers));
router.get("/:id", asyncHandler(getCareerById));

export default router;

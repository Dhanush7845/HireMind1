import express from "express";
import {
  getUserAnalyses,
  getAnalysisById,
  getDashboardStats,
} from "../controllers/analysisController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard/stats", getDashboardStats);
router.get("/", getUserAnalyses);
router.get("/:id", getAnalysisById);

export default router;

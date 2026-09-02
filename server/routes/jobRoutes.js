import express from "express";
import {
  analyzeJob,
  getJobHistory,
  getJobMatchById,
  deleteJobMatch,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/analyze", analyzeJob);
router.get("/history", getJobHistory);
router.get("/:id", getJobMatchById);
router.delete("/:id", deleteJobMatch);

export default router;

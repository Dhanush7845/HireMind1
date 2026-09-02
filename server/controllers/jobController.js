import JobMatch from "../models/JobMatch.js";
import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import User from "../models/User.js";
import { analyzeJobDescription } from "../services/jobMatcher.js";

// @desc    Analyze a job description against candidate resume
// @route   POST /api/jobs/analyze
// @access  Private
export const analyzeJob = async (req, res, next) => {
  try {
    const { jobDescription, jobTitle = "Software Developer Position", company = "Tech Company", resumeId } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Please paste a complete job description (minimum 20 characters) for analysis.",
      });
    }

    // 1. Determine candidate skills to match against
    let targetResume = null;
    let candidateSkills = [];

    if (resumeId) {
      targetResume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    }

    if (!targetResume) {
      // Find latest uploaded resume
      targetResume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    }

    if (targetResume) {
      const analysis = await Analysis.findOne({ resumeId: targetResume._id });
      candidateSkills = analysis?.skills || [];
    }

    // If candidate has no resume skills, fall back to user profile skills
    if (candidateSkills.length === 0) {
      const user = await User.findById(req.userId);
      candidateSkills = user?.skills || [];
    }

    // 2. Perform intelligent matching & gap detection
    const matchResult = analyzeJobDescription(jobDescription, candidateSkills);

    // 3. Save JobMatch record
    const jobMatch = await JobMatch.create({
      userId: req.userId,
      resumeId: targetResume?._id || null,
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      jobDescription: jobDescription.trim(),
      matchScore: matchResult.matchScore,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      requiredSkills: matchResult.requiredSkills,
      preferredSkills: matchResult.preferredSkills,
      keywordMatches: matchResult.keywordMatches,
      recommendations: matchResult.recommendations,
      explanation: matchResult.explanation,
    });

    res.status(201).json({
      success: true,
      message: "Job description analyzed successfully.",
      data: {
        id: jobMatch._id,
        jobTitle: jobMatch.jobTitle,
        company: jobMatch.company,
        matchScore: jobMatch.matchScore,
        matchCategory: matchResult.matchCategory,
        matchedSkills: jobMatch.matchedSkills,
        missingSkills: jobMatch.missingSkills,
        requiredSkills: jobMatch.requiredSkills,
        preferredSkills: jobMatch.preferredSkills,
        recommendedSkills: matchResult.recommendedSkills,
        keywordMatches: jobMatch.keywordMatches,
        recommendations: jobMatch.recommendations,
        explanation: jobMatch.explanation,
        candidateSkillsUsed: candidateSkills,
        resumeUsed: targetResume?.originalName || null,
        createdAt: jobMatch.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job match history for authenticated user
// @route   GET /api/jobs/history
// @access  Private
export const getJobHistory = async (req, res, next) => {
  try {
    const history = await JobMatch.find({ userId: req.userId })
      .populate("resumeId", "originalName createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job match by ID
// @route   GET /api/jobs/:id
// @access  Private
export const getJobMatchById = async (req, res, next) => {
  try {
    const jobMatch = await JobMatch.findOne({ _id: req.params.id, userId: req.userId })
      .populate("resumeId", "originalName createdAt");

    if (!jobMatch) {
      return res.status(404).json({
        success: false,
        message: "Job match report not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: jobMatch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single job match
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJobMatch = async (req, res, next) => {
  try {
    const jobMatch = await JobMatch.findOne({ _id: req.params.id, userId: req.userId });

    if (!jobMatch) {
      return res.status(404).json({
        success: false,
        message: "Job match record not found.",
      });
    }

    await jobMatch.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job match record deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

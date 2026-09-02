import JobMatch from "../models/JobMatch.js";
import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import User from "../models/User.js";
import { extractSkills } from "../services/skillExtractor.js";
import {
  extractSoftSkills,
  extractExperienceRequirement,
  extractEducationRequirement,
  analyzeSkillGaps,
} from "../services/skillGapService.js";
import { calculatePlacementReadiness } from "../services/placementReadinessService.js";
import { generatePersonalizedRoadmap } from "../services/roadmapService.js";
import { generateProjectRecommendations } from "../services/projectRecommendationService.js";

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

    // 1. Determine candidate resume & skills to match against
    let targetResume = null;
    let targetAnalysis = null;
    let candidateSkills = [];

    if (resumeId) {
      targetResume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    }

    if (!targetResume) {
      // Find latest uploaded resume
      targetResume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    }

    if (targetResume) {
      targetAnalysis = await Analysis.findOne({ resumeId: targetResume._id });
      candidateSkills = targetAnalysis?.skills || [];
    }

    // If candidate has no resume skills, fall back to user profile skills
    if (candidateSkills.length === 0) {
      const user = await User.findById(req.userId);
      candidateSkills = user?.skills || ["JavaScript", "Python", "React", "Node.js", "SQL"];
    }

    // 2. Extract Job Requirements, Soft Skills, and Constraints from Job Description
    const jobSkillsData = extractSkills(jobDescription);
    const jobSkills = jobSkillsData.allSkills;

    // Segment Required vs Preferred skills
    const requiredSkills = [];
    const preferredSkills = [];
    const sentences = jobDescription.split(/[.!?\n]/);

    for (const skill of jobSkills) {
      const sLower = skill.toLowerCase();
      let isPreferred = false;
      for (const sentence of sentences) {
        const sentLower = sentence.toLowerCase();
        if (sentLower.includes(sLower)) {
          if (
            sentLower.includes("preferred") ||
            sentLower.includes("nice to have") ||
            sentLower.includes("bonus") ||
            sentLower.includes("plus")
          ) {
            isPreferred = true;
            break;
          }
        }
      }
      if (isPreferred) preferredSkills.push(skill);
      else requiredSkills.push(skill);
    }

    if (requiredSkills.length === 0 && jobSkills.length > 0) {
      requiredSkills.push(...jobSkills);
    }

    const softSkills = extractSoftSkills(jobDescription);
    const experienceRequired = extractExperienceRequirement(jobDescription);
    const educationRequired = extractEducationRequirement(jobDescription);

    // 3. Perform Skill Gap Analysis (?? Strong, ?? Needs Improvement, ?? Missing)
    const gapAnalysis = analyzeSkillGaps(jobSkills, requiredSkills, preferredSkills, candidateSkills);

    // 4. Calculate Placement Readiness Score (0-100) with category breakdown
    const placementReadiness = calculatePlacementReadiness({
      atsScore: targetAnalysis?.score || 75,
      jobMatchScore: gapAnalysis.matchScore,
      candidateSkills,
      projects: targetAnalysis?.extractedInfo?.projects || [],
      experience: targetAnalysis?.extractedInfo?.experience || [],
      certifications: targetAnalysis?.extractedInfo?.certifications || [],
      strongMatches: gapAnalysis.strongMatches,
      partialMatches: gapAnalysis.partialMatches,
      missingMatches: gapAnalysis.missingMatches,
      rawText: targetResume?.rawText || "",
    });

    // 5. Generate Dynamic Personalized Learning Roadmap
    const roadmap = generatePersonalizedRoadmap(
      gapAnalysis.missingMatches,
      gapAnalysis.partialMatches,
      jobTitle
    );

    // 6. Generate Targeted Project Recommendations
    const projectRecommendations = generateProjectRecommendations(
      gapAnalysis.missingMatches,
      gapAnalysis.partialMatches,
      jobTitle
    );

    // 7. Extract Keyword Density Matches
    const keywordsList = [
      "microservices", "rest api", "scalability", "cloud", "ci/cd", "unit testing",
      "agile", "scrum", "system design", "distributed systems", "database design",
      "problem solving", "cross-functional", "clean code", "performance optimization"
    ];

    const keywordMatches = [];
    const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
    for (const kw of keywordsList) {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      const matches = jobDescription.match(regex);
      if (matches && matches.length > 0) {
        const inCandidate = candidateSkillsLower.some((c) => c.includes(kw)) || new RegExp(`\\b${kw}\\b`, "i").test(targetResume?.rawText || "");
        keywordMatches.push({
          keyword: kw.toUpperCase(),
          frequencyInJob: matches.length,
          presentInResume: inCandidate,
        });
      }
    }

    // Actionable Recommendations
    const recommendations = [];
    if (gapAnalysis.missingMatches.length > 0) {
      recommendations.push(
        `Focus preparation on high-priority missing requirements: ${gapAnalysis.missingMatches.slice(0, 3).join(", ")}.`
      );
    }
    if (gapAnalysis.partialMatches.length > 0) {
      recommendations.push(
        `Solidify practical hands-on experience with: ${gapAnalysis.partialMatches.slice(0, 2).join(", ")} to turn partial matches into strong matches.`
      );
    }
    if (gapAnalysis.strongMatches.length > 0) {
      recommendations.push(
        `Highlight your proven accomplishments with ${gapAnalysis.strongMatches.slice(0, 3).join(", ")} prominently in your resume summary.`
      );
    }

    // 8. Save JobMatch Record to MongoDB
    const jobMatch = await JobMatch.create({
      userId: req.userId,
      resumeId: targetResume?._id || null,
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      jobDescription: jobDescription.trim(),
      matchScore: gapAnalysis.matchScore,
      strongMatches: gapAnalysis.strongMatches,
      partialMatches: gapAnalysis.partialMatches,
      missingMatches: gapAnalysis.missingMatches,
      matchedSkills: gapAnalysis.strongMatches,
      missingSkills: gapAnalysis.missingMatches,
      requiredSkills,
      preferredSkills,
      softSkills,
      experienceRequired,
      educationRequired,
      skillGaps: gapAnalysis.skillGapMatrix,
      placementReadiness,
      roadmap,
      projectRecommendations,
      keywordMatches,
      recommendations,
      explanation: placementReadiness.explanation,
    });

    res.status(201).json({
      success: true,
      message: "Job description analyzed and placement intelligence generated successfully.",
      data: {
        id: jobMatch._id,
        jobTitle: jobMatch.jobTitle,
        company: jobMatch.company,
        matchScore: jobMatch.matchScore,
        strongMatches: jobMatch.strongMatches,
        partialMatches: jobMatch.partialMatches,
        missingMatches: jobMatch.missingMatches,
        matchedSkills: jobMatch.matchedSkills,
        missingSkills: jobMatch.missingSkills,
        requiredSkills: jobMatch.requiredSkills,
        preferredSkills: jobMatch.preferredSkills,
        softSkills: jobMatch.softSkills,
        experienceRequired: jobMatch.experienceRequired,
        educationRequired: jobMatch.educationRequired,
        skillGaps: jobMatch.skillGaps,
        placementReadiness: jobMatch.placementReadiness,
        roadmap: jobMatch.roadmap,
        projectRecommendations: jobMatch.projectRecommendations,
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

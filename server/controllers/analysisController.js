import Analysis from "../models/Analysis.js";
import Resume from "../models/Resume.js";
import JobMatch from "../models/JobMatch.js";

// @desc    Get user's analysis history
// @route   GET /api/analysis
// @access  Private
export const getUserAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .populate("resumeId", "originalName fileType fileSize createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single analysis by ID
// @route   GET /api/analysis/:id
// @access  Private
export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.userId })
      .populate("resumeId", "originalName fileType fileSize createdAt");

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis report not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & aggregated stats with placement readiness
// @route   GET /api/analysis/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId }).sort({ createdAt: -1 });
    const resumes = await Resume.find({ userId: req.userId }).sort({ createdAt: -1 });
    const jobMatches = await JobMatch.find({ userId: req.userId }).sort({ createdAt: -1 });

    const totalResumes = resumes.length;
    const totalAnalyses = analyses.length;
    const totalJobMatches = jobMatches.length;

    const latestAnalysis = analyses[0] || null;
    const latestJobMatch = jobMatches[0] || null;

    // Multi-metric progress tracking (chronological)
    const reversedAnalyses = [...analyses].reverse();
    const reversedJobMatches = [...jobMatches].reverse();

    const maxEntries = Math.max(reversedAnalyses.length, reversedJobMatches.length, 1);
    const progressHistory = [];

    for (let i = 0; i < maxEntries; i++) {
      const a = reversedAnalyses[i] || latestAnalysis;
      const j = reversedJobMatches[i] || latestJobMatch;

      const dateStr = a?.createdAt
        ? new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : `Iteration #${i + 1}`;

      progressHistory.push({
        label: `Iter #${i + 1}`,
        date: dateStr,
        resumeScore: a?.score || 70,
        placementReadiness: j?.placementReadiness?.score || (a ? Math.max(20, a.score - 8) : 65),
        jobMatchScore: j?.matchScore || 72,
      });
    }

    // Aggregate skill categories from latest analysis
    const skillDistribution = latestAnalysis?.skillsByCategory || {
      programmingLanguages: [],
      frameworks: [],
      databases: [],
      cloudAndDevops: [],
      aiAndData: [],
      tools: [],
      coreCs: [],
      other: [],
    };

    // Calculate action counts
    const skillGapsCount = latestJobMatch?.missingMatches?.length || latestJobMatch?.missingSkills?.length || 0;
    const roadmapMilestonesCount = latestJobMatch?.roadmap?.milestones?.length || 0;
    const projectRecsCount = latestJobMatch?.projectRecommendations?.length || 0;
    const recommendedActionsCount = (latestAnalysis?.recommendations?.length || 0) + roadmapMilestonesCount + projectRecsCount;

    res.status(200).json({
      success: true,
      data: {
        totalResumes,
        totalAnalyses,
        totalJobMatches,
        latestScore: latestAnalysis?.score || 0,
        latestGrade: latestAnalysis ? (latestAnalysis.score >= 80 ? "ATS Ready" : latestAnalysis.score >= 60 ? "Competitive" : "Needs Work") : "N/A",
        placementReadiness: latestJobMatch?.placementReadiness?.score || (latestAnalysis ? Math.max(20, latestAnalysis.score - 6) : 0),
        placementReadinessTier: latestJobMatch?.placementReadiness?.tier || "Requires Preparation",
        placementExplanation: latestJobMatch?.placementReadiness?.explanation || "Upload your resume and analyze a target job description to generate full placement readiness.",
        latestJobMatchScore: latestJobMatch?.matchScore || 0,
        skillsDetectedCount: latestAnalysis?.skills?.length || 0,
        skillGapsCount,
        recommendedActionsCount: recommendedActionsCount > 0 ? recommendedActionsCount : 7,
        latestAnalysisId: latestAnalysis?._id || null,
        latestJobMatchId: latestJobMatch?._id || null,
        latestResume: resumes[0] || null,
        latestJobMatch,
        progressHistory,
        scoreHistory: progressHistory.map((p) => ({ date: p.date, score: p.resumeScore, label: p.label })),
        skillDistribution: {
          "Languages": skillDistribution.programmingLanguages?.length || 0,
          "Frameworks": skillDistribution.frameworks?.length || 0,
          "Databases": skillDistribution.databases?.length || 0,
          "Cloud & DevOps": skillDistribution.cloudAndDevops?.length || 0,
          "AI & Data": skillDistribution.aiAndData?.length || 0,
          "Tools": skillDistribution.tools?.length || 0,
          "Core CS": skillDistribution.coreCs?.length || 0,
        },
        recentAnalyses: analyses.slice(0, 5),
        recentJobMatches: jobMatches.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

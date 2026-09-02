import fs from "fs";
import path from "path";
import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import JobMatch from "../models/JobMatch.js";
import { parseResumeFile } from "../services/resumeParser.js";
import { analyzeResume } from "../services/resumeAnalyzer.js";
import { calculateAtsScore } from "../services/atsScorer.js";

// @desc    Upload resume, parse text, calculate ATS score and store structured analysis
// @route   POST /api/resumes/upload
// @access  Private
export const uploadResumeFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded. Please upload a PDF, DOCX, DOC, or TXT file.",
      });
    }

    const { originalname, filename, path: filePath, size } = req.file;
    const ext = path.extname(originalname).replace(".", "").toLowerCase();

    // 1. Parse document text
    let rawText = "";
    try {
      rawText = await parseResumeFile(filePath, ext);
    } catch (parseError) {
      // Clean up uploaded file if parsing fails
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(422).json({
        success: false,
        message: `Resume parsing failed: ${parseError.message}`,
      });
    }

    // 2. Perform deep entity & section extraction
    const extractedData = analyzeResume(rawText);

    // 3. Compute deterministic ATS Score & recommendations
    const atsResult = calculateAtsScore(extractedData);

    // 4. Create Resume in DB
    const resume = await Resume.create({
      userId: req.userId,
      originalName: originalname,
      fileName: filename,
      filePath,
      fileType: ext,
      fileSize: size,
      rawText,
    });

    // 5. Create Analysis in DB
    const analysis = await Analysis.create({
      userId: req.userId,
      resumeId: resume._id,
      score: atsResult.score,
      scoreBreakdown: atsResult.scoreBreakdown,
      skills: extractedData.skills,
      skillsByCategory: extractedData.skillsByCategory,
      extractedInfo: {
        personalInfo: extractedData.personalInfo,
        education: extractedData.education,
        experience: extractedData.experience,
        projects: extractedData.projects,
        certifications: extractedData.certifications,
      },
      strengths: atsResult.strengths,
      weaknesses: atsResult.weaknesses,
      recommendations: atsResult.recommendations,
      recommendedRoles: extractedData.recommendedRoles,
      summary: atsResult.summary,
    });

    // 6. Link analysis snapshot to resume
    resume.analysis = {
      analysisId: analysis._id,
      score: atsResult.score,
      skillsCount: extractedData.skillCount,
      summary: atsResult.summary,
    };
    await resume.save();

    res.status(201).json({
      success: true,
      message: "Resume successfully uploaded, parsed, and analyzed.",
      data: {
        resume: {
          id: resume._id,
          originalName: resume.originalName,
          fileType: resume.fileType,
          fileSize: resume.fileSize,
          createdAt: resume.createdAt,
        },
        analysis: {
          id: analysis._id,
          score: analysis.score,
          grade: atsResult.grade,
          scoreBreakdown: analysis.scoreBreakdown,
          skills: analysis.skills,
          skillsByCategory: analysis.skillsByCategory,
          extractedInfo: analysis.extractedInfo,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          recommendations: analysis.recommendations,
          recommendedRoles: analysis.recommendedRoles,
          summary: analysis.summary,
          createdAt: analysis.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes for the authenticated user
// @route   GET /api/resumes
// @access  Private
export const getUserResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume with analysis
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const analysis = await Analysis.findOne({ resumeId: resume._id });

    res.status(200).json({
      success: true,
      data: {
        resume,
        analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume and related analyses
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    // Remove file from disk if exists
    if (fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (err) {
        console.warn("Could not delete file from disk:", err.message);
      }
    }

    // Delete associated analysis and job matches
    await Analysis.deleteMany({ resumeId: resume._id });
    await JobMatch.deleteMany({ resumeId: resume._id });
    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resume and associated analyses deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

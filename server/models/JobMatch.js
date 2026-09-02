import mongoose from "mongoose";

const jobMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
    jobTitle: {
      type: String,
      default: "Custom Job Description",
    },
    company: {
      type: String,
      default: "",
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    strongMatches: {
      type: [String],
      default: [],
    },
    partialMatches: {
      type: [String],
      default: [],
    },
    missingMatches: {
      type: [String],
      default: [],
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    softSkills: {
      type: [String],
      default: [],
    },
    experienceRequired: {
      type: String,
      default: "",
    },
    educationRequired: {
      type: String,
      default: "",
    },
    skillGaps: [
      {
        skill: String,
        resumeStatus: String,
        statusBadge: String,
        jobRequirement: String,
        gapLevel: String,
        gapColor: String,
        rationale: String,
      },
    ],
    placementReadiness: {
      score: { type: Number, default: 65 },
      tier: { type: String, default: "Requires Focused Preparation" },
      tierBadge: { type: String, default: "badge-moderate" },
      explanation: { type: String, default: "" },
      breakdown: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    roadmap: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    projectRecommendations: [
      {
        title: String,
        description: String,
        skillsAddressed: [String],
        technologies: [String],
        features: [String],
        impactOnMatch: String,
        resumeBulletExample: String,
      },
    ],
    keywordMatches: [
      {
        keyword: String,
        frequencyInJob: Number,
        presentInResume: Boolean,
      },
    ],
    recommendations: {
      type: [String],
      default: [],
    },
    explanation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const JobMatch = mongoose.model("JobMatch", jobMatchSchema);
export default JobMatch;

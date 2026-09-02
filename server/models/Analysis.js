import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    scoreBreakdown: {
      skillsScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      projectsScore: { type: Number, default: 0 },
      educationScore: { type: Number, default: 0 },
      structureScore: { type: Number, default: 0 },
      keywordsScore: { type: Number, default: 0 },
      contactScore: { type: Number, default: 0 },
      certificationsScore: { type: Number, default: 0 },
    },
    skills: {
      type: [String],
      default: [],
    },
    skillsByCategory: {
      programmingLanguages: { type: [String], default: [] },
      frameworks: { type: [String], default: [] },
      databases: { type: [String], default: [] },
      cloudAndDevops: { type: [String], default: [] },
      aiAndData: { type: [String], default: [] },
      tools: { type: [String], default: [] },
      coreCs: { type: [String], default: [] },
      other: { type: [String], default: [] },
    },
    extractedInfo: {
      personalInfo: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" },
        location: { type: String, default: "" },
      },
      education: [
        {
          degree: String,
          college: String,
          cgpa: String,
          graduationYear: String,
        },
      ],
      experience: [
        {
          role: String,
          company: String,
          duration: String,
          responsibilities: [String],
        },
      ],
      projects: [
        {
          name: String,
          technologies: [String],
          description: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
        },
      ],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    recommendations: [
      {
        category: { type: String, default: "General" },
        priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
        title: { type: String, default: "" },
        action: { type: String, default: "" },
        impact: { type: String, default: "" },
      },
    ],
    recommendedRoles: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;

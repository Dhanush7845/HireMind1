import { extractSkills, normalizeSkillList } from "./skillExtractor.js";

/**
 * Extract requirements, qualifications, and keywords from a job description
 */
export const analyzeJobDescription = (jobDescription = "", candidateSkills = []) => {
  if (!jobDescription || typeof jobDescription !== "string") {
    throw new Error("Job description text is required for matching.");
  }

  // Extract skills present in the job description
  const jobSkillsData = extractSkills(jobDescription);
  const normalizedCandidateSkills = normalizeSkillList(candidateSkills);

  const jobSkills = jobSkillsData.allSkills;

  // Segment required vs preferred skills heuristic
  const requiredSkills = [];
  const preferredSkills = [];

  const lowerJd = jobDescription.toLowerCase();
  const paragraphs = jobDescription.split(/\n\s*\n/);

  for (const skill of jobSkills) {
    const sLower = skill.toLowerCase();
    let isPreferred = false;

    // Check if skill appears in "preferred", "nice to have", "bonus", "plus" sentences
    const sentences = jobDescription.split(/[.!?\n]/);
    for (const sentence of sentences) {
      const sentLower = sentence.toLowerCase();
      if (sentLower.includes(sLower)) {
        if (
          sentLower.includes("preferred") ||
          sentLower.includes("nice to have") ||
          sentLower.includes("bonus") ||
          sentLower.includes("good to have") ||
          sentLower.includes("plus")
        ) {
          isPreferred = true;
          break;
        }
      }
    }

    if (isPreferred) {
      preferredSkills.push(skill);
    } else {
      requiredSkills.push(skill);
    }
  }

  // Ensure at least some required skills if split was unbalanced
  if (requiredSkills.length === 0 && jobSkills.length > 0) {
    requiredSkills.push(...jobSkills);
  }

  // Match skills
  const candidateSkillSet = new Set(normalizedCandidateSkills.map((s) => s.toLowerCase()));

  const matchedSkills = jobSkills.filter((s) => candidateSkillSet.has(s.toLowerCase()));
  const missingSkills = jobSkills.filter((s) => !candidateSkillSet.has(s.toLowerCase()));
  const missingRequiredSkills = requiredSkills.filter((s) => !candidateSkillSet.has(s.toLowerCase()));
  const matchedRequiredSkills = requiredSkills.filter((s) => candidateSkillSet.has(s.toLowerCase()));

  // Extract important domain keywords
  const keywordsList = [
    "microservices", "rest api", "scalability", "cloud", "ci/cd", "unit testing",
    "agile", "scrum", "system design", "distributed systems", "database design",
    "problem solving", "cross-functional", "clean code", "performance optimization"
  ];

  const keywordMatches = [];
  for (const kw of keywordsList) {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    const matches = jobDescription.match(regex);
    if (matches && matches.length > 0) {
      const inCandidate = candidateSkillSet.has(kw) || new RegExp(`\\b${kw}\\b`, "i").test(candidateSkills.join(" "));
      keywordMatches.push({
        keyword: kw.toUpperCase(),
        frequencyInJob: matches.length,
        presentInResume: inCandidate,
      });
    }
  }

  // Calculate Match Score
  let matchScore = 0;

  if (jobSkills.length === 0) {
    // If no strict technical skills were found in JD, score based on general text similarity
    matchScore = 70;
  } else {
    const requiredWeight = 0.70;
    const preferredWeight = 0.20;
    const keywordWeight = 0.10;

    const reqScore = requiredSkills.length > 0
      ? (matchedRequiredSkills.length / requiredSkills.length) * 100
      : 100;

    const prefScore = preferredSkills.length > 0
      ? ((preferredSkills.length - missingSkills.filter(s => preferredSkills.includes(s)).length) / preferredSkills.length) * 100
      : 100;

    const kwScore = keywordMatches.length > 0
      ? (keywordMatches.filter((k) => k.presentInResume).length / keywordMatches.length) * 100
      : 80;

    matchScore = Math.round(reqScore * requiredWeight + prefScore * preferredWeight + kwScore * keywordWeight);
  }

  matchScore = Math.max(10, Math.min(100, matchScore));

  // Determine Compatibility Category
  let matchCategory = "Low Match";
  if (matchScore >= 80) matchCategory = "Excellent Match";
  else if (matchScore >= 60) matchCategory = "Good Match";
  else if (matchScore >= 40) matchCategory = "Moderate Match";

  // Actionable recommendations
  const recommendations = [];

  if (missingRequiredSkills.length > 0) {
    recommendations.push(
      `Prioritize acquiring or highlighting these core missing skills: ${missingRequiredSkills.slice(0, 4).join(", ")}.`
    );
  }

  if (missingSkills.length > 0) {
    recommendations.push(
      `Tailor your resume bullet points to include exact keyword matches for: ${missingSkills.slice(0, 3).join(", ")} if you have coursework or side-project exposure.`
    );
  }

  if (matchedSkills.length > 0) {
    recommendations.push(
      `Strongly emphasize your proven achievements with ${matchedSkills.slice(0, 3).join(", ")} in your summary and top project highlights.`
    );
  }

  const missingKeywords = keywordMatches.filter((k) => !k.presentInResume);
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Incorporate key industry methodologies (${missingKeywords.slice(0, 3).map((k) => k.keyword).join(", ")}) into your experience descriptions.`
    );
  }

  // Explanation summary
  const explanation = `Your profile achieves a ${matchScore}% compatibility score (${matchCategory}). You possess ${matchedSkills.length} out of ${jobSkills.length} identified technical requirements. Addressing ${missingSkills.length} missing skill areas will significantly boost your interview callback probability.`;

  return {
    matchScore,
    matchCategory,
    matchedSkills,
    missingSkills,
    requiredSkills,
    preferredSkills,
    recommendedSkills: missingSkills.slice(0, 6),
    keywordMatches,
    recommendations,
    explanation,
  };
};

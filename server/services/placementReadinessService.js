/**
 * Deterministic Placement Readiness Scoring Engine
 * Evaluates candidate readiness against a specific job role across 8 key dimensions:
 * 1. Resume Quality & ATS Score (15%)
 * 2. Job Match & Skill Fit (25%)
 * 3. Technical Skills Depth (20%)
 * 4. Project Depth & Relevance (15%)
 * 5. Internship / Work Experience (10%)
 * 6. DSA & Problem Solving (5%)
 * 7. Certifications & Badges (5%)
 * 8. Interview Readiness (5%)
 */

export const calculatePlacementReadiness = ({
  atsScore = 75,
  jobMatchScore = 70,
  candidateSkills = [],
  projects = [],
  experience = [],
  certifications = [],
  strongMatches = [],
  partialMatches = [],
  missingMatches = [],
  rawText = "",
}) => {
  // 1. Resume Quality (15 pts max)
  const resumeQualityScore = Math.round((Math.min(100, atsScore) / 100) * 15);

  // 2. Job Match & Skill Fit (25 pts max)
  const jobMatchContribution = Math.round((Math.min(100, jobMatchScore) / 100) * 25);

  // 3. Technical Skills Depth (20 pts max)
  const skillsCount = candidateSkills.length;
  let techSkillsScore = 0;
  if (skillsCount >= 14) techSkillsScore = 20;
  else if (skillsCount >= 10) techSkillsScore = 16;
  else if (skillsCount >= 6) techSkillsScore = 12;
  else techSkillsScore = 6;

  // 4. Projects Depth & Relevance (15 pts max)
  const projCount = projects.length;
  let projectsScore = 0;
  if (projCount >= 3) projectsScore = 15;
  else if (projCount === 2) projectsScore = 12;
  else if (projCount === 1) projectsScore = 8;
  else projectsScore = 3;

  // 5. Internship / Experience (10 pts max)
  const expCount = experience.length;
  let experienceScore = 0;
  if (expCount >= 2) experienceScore = 10;
  else if (expCount === 1) experienceScore = 8;
  else if (projCount >= 2) experienceScore = 5;
  else experienceScore = 2;

  // 6. DSA / Problem Solving (5 pts max)
  const lowerText = rawText.toLowerCase();
  const hasDsa =
    candidateSkills.some((s) => s.toLowerCase().includes("data structures") || s.toLowerCase().includes("algorithm") || s.toLowerCase().includes("dsa")) ||
    lowerText.includes("leetcode") ||
    lowerText.includes("hackerrank") ||
    lowerText.includes("codeforces");
  const dsaScore = hasDsa ? 5 : 2;

  // 7. Certifications (5 pts max)
  const certCount = certifications.length;
  let certScore = 0;
  if (certCount >= 2) certScore = 5;
  else if (certCount === 1) certScore = 3;
  else certScore = 1;

  // 8. Interview Readiness (5 pts max)
  // Evaluated by combination of strong matches and quantifiable metrics in experience/projects
  const hasMetrics = /(\b\d+%\b|\b\d+x\b|\breduced\b|\bscaled\b|\bimproved\b)/i.test(rawText);
  let interviewReadinessScore = 2;
  if (strongMatches.length >= 3) interviewReadinessScore += 1;
  if (hasMetrics) interviewReadinessScore += 2;
  interviewReadinessScore = Math.min(5, interviewReadinessScore);

  // Final Total (0 - 100)
  const totalScore = Math.max(
    15,
    Math.min(
      100,
      resumeQualityScore +
        jobMatchContribution +
        techSkillsScore +
        projectsScore +
        experienceScore +
        dsaScore +
        certScore +
        interviewReadinessScore
    )
  );

  // Status Tier
  let tier = "Needs Foundational Upskilling";
  let tierBadge = "badge-low";
  if (totalScore >= 80) {
    tier = "Placement Ready & Competitive";
    tierBadge = "badge-excellent";
  } else if (totalScore >= 65) {
    tier = "Close to Ready ? Minor Gaps";
    tierBadge = "badge-good";
  } else if (totalScore >= 45) {
    tier = "Requires Focused Preparation";
    tierBadge = "badge-moderate";
  }

  // Explainability Generator
  let explanation = "";
  const strongList = strongMatches.slice(0, 3).join(", ");
  const missingList = missingMatches.slice(0, 3).join(", ");

  if (strongMatches.length > 0 && missingMatches.length > 0) {
    explanation = `Your placement readiness score is ${totalScore}/100 because your profile demonstrates strong proficiency in ${strongList} and solid project depth, but you have key technical skill gaps in ${missingList}${
      partialMatches.length > 0 ? ` and partial familiarity with ${partialMatches.slice(0, 2).join(", ")}` : ""
    }.`;
  } else if (missingMatches.length === 0) {
    explanation = `Your placement readiness score is ${totalScore}/100 with 100% core skill alignment. Your technical profile directly satisfies all requirements for this role.`;
  } else {
    explanation = `Your placement readiness score is ${totalScore}/100. Targeted technical preparation in ${missingList} and building full-stack project artifacts will substantially accelerate your interview readiness.`;
  }

  return {
    score: totalScore,
    tier,
    tierBadge,
    explanation,
    breakdown: {
      resumeQuality: { score: resumeQualityScore, max: 15, label: "Resume Quality & ATS" },
      jobMatch: { score: jobMatchContribution, max: 25, label: "Job Match & Skill Fit" },
      technicalSkills: { score: techSkillsScore, max: 20, label: "Technical Skills Arsenal" },
      projects: { score: projectsScore, max: 15, label: "Projects Relevance" },
      experience: { score: experienceScore, max: 10, label: "Internship & Work Experience" },
      dsa: { score: dsaScore, max: 5, label: "DSA & Problem Solving" },
      certifications: { score: certScore, max: 5, label: "Certifications & Badges" },
      interviewReadiness: { score: interviewReadinessScore, max: 5, label: "Interview Readiness" },
    },
  };
};

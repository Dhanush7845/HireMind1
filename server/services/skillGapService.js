import { extractSkills, normalizeSkillList } from "./skillExtractor.js";

// Related/Adjacent Skill Mappings for Partial Match Detection (where foundational knowledge allows rapid upskilling)
const ADJACENT_SKILLS = {
  typescript: ["javascript"],
  "next.js": ["react"],
  "react native": ["react"],
  flutter: ["dart"],
  postgresql: ["sql", "mysql"],
  mongodb: ["nosql", "databases"],
  redis: ["caching"],
  "ci/cd": ["github actions", "jenkins"],
  tailwind: ["bootstrap"],
  redux: ["react context"],
  pytorch: ["tensorflow"],
  tensorflow: ["pytorch"],
  nlp: ["machine learning", "deep learning"],
  "computer vision": ["machine learning", "deep learning"],
  "data structures & algorithms": ["c++", "c", "problem solving"],
};

/**
 * Extract soft skills from job descriptions
 */
export const extractSoftSkills = (jobDescription = "") => {
  const softSkillsCatalog = [
    "Problem Solving",
    "Communication",
    "Teamwork & Collaboration",
    "Critical Thinking",
    "Agile / Scrum Mindset",
    "Time Management",
    "Adaptability",
    "Leadership",
    "Attention to Detail",
    "Analytical Thinking",
  ];

  const lower = jobDescription.toLowerCase();
  const detected = [];

  const softPatterns = {
    "Problem Solving": /problem[\s-]solving|analytical thinking|troubleshooting/i,
    "Communication": /communication skills|verbal|written communication|presentation/i,
    "Teamwork & Collaboration": /team player|teamwork|cross-functional|collaborative|collaboration/i,
    "Critical Thinking": /critical thinking|analytical mindset|decision making/i,
    "Agile / Scrum Mindset": /agile|scrum|sprint|kanban/i,
    "Time Management": /time management|prioritization|deadline|fast-paced/i,
    "Adaptability": /adaptability|fast learner|quick learner|flexible/i,
    "Leadership": /leadership|mentoring|ownership|self-starter|initiative/i,
    "Attention to Detail": /detail-oriented|attention to detail|code quality/i,
  };

  for (const [skill, regex] of Object.entries(softPatterns)) {
    if (regex.test(lower)) {
      detected.push(skill);
    }
  }

  return detected.length > 0 ? detected : ["Problem Solving", "Teamwork & Collaboration", "Communication"];
};

/**
 * Extract experience requirements from job description
 */
export const extractExperienceRequirement = (jobDescription = "") => {
  const expMatch = jobDescription.match(/(\d+\+?\s*(?:-\s*\d+)?\s*(?:years?|yrs?)(?:\s*of)?\s*experience|\bfresher\b|\bentry[\s-]level\b|\b0-1\s*years?\b|\b2\+\s*years?\b|\b3\+\s*years?\b)/i);
  return expMatch ? expMatch[0].trim() : "0-2 Years / Entry Level";
};

/**
 * Extract education requirements from job description
 */
export const extractEducationRequirement = (jobDescription = "") => {
  const eduMatch = jobDescription.match(/(?:b\.tech|b\.e\.|bachelor['?]?s?|master['?]?s?|m\.tech|m\.s\.|bca|mca|computer science|related technical field)/i);
  return eduMatch ? "B.Tech / B.E. / B.S. in Computer Science or related engineering field" : "Bachelor's Degree in CS/IT or equivalent practical experience";
};

/**
 * Perform deep Skill Gap Analysis categorizing every skill requirement
 */
export const analyzeSkillGaps = (jobSkills = [], requiredSkills = [], preferredSkills = [], candidateSkills = []) => {
  const normalizedCandidate = candidateSkills.map((s) => s.toLowerCase().trim());
  const candidateSkillSet = new Set(normalizedCandidate);

  const strongMatches = [];
  const partialMatches = [];
  const missingMatches = [];
  const skillGapMatrix = [];

  for (const skill of jobSkills) {
    const sLower = skill.toLowerCase().trim();
    const isRequired = requiredSkills.some((rs) => rs.toLowerCase().trim() === sLower);
    const reqType = isRequired ? "Required" : "Preferred";

    if (candidateSkillSet.has(sLower)) {
      // ?? STRONG MATCH
      strongMatches.push(skill);
      skillGapMatrix.push({
        skill,
        resumeStatus: "Strong",
        statusBadge: "?? Strong",
        jobRequirement: reqType,
        gapLevel: "Low",
        gapColor: "var(--accent-emerald)",
        rationale: "Direct skill match verified on your resume.",
      });
    } else {
      // Check for adjacent/partial skills
      const adjacents = ADJACENT_SKILLS[sLower] || [];
      const hasAdjacent = adjacents.some((adj) => candidateSkillSet.has(adj));

      if (hasAdjacent) {
        // ?? PARTIAL MATCH / NEEDS IMPROVEMENT
        partialMatches.push(skill);
        const relatedFound = adjacents.filter((adj) => candidateSkillSet.has(adj)).slice(0, 2).join(", ");
        skillGapMatrix.push({
          skill,
          resumeStatus: "Needs Improvement",
          statusBadge: "?? Needs Improvement",
          jobRequirement: reqType,
          gapLevel: reqType === "Required" ? "Medium" : "Low",
          gapColor: "var(--accent-amber)",
          rationale: `Foundational background detected via related skill (${relatedFound}), but dedicated experience with ${skill} needs strengthening.`,
        });
      } else {
        // ?? MISSING SKILL
        missingMatches.push(skill);
        skillGapMatrix.push({
          skill,
          resumeStatus: "Missing",
          statusBadge: "?? Missing",
          jobRequirement: reqType,
          gapLevel: reqType === "Required" ? "High" : "Medium",
          gapColor: "var(--accent-rose)",
          rationale: `Skill is not mentioned on your resume and is ${reqType.toLowerCase()} for this role.`,
        });
      }
    }
  }

  // Calculate Overall Match Score
  const totalWeight = jobSkills.length > 0 ? jobSkills.length : 1;
  const earnedScore = strongMatches.length * 1.0 + partialMatches.length * 0.5;
  const matchScore = Math.max(15, Math.min(100, Math.round((earnedScore / totalWeight) * 100)));

  return {
    matchScore,
    strongMatches,
    partialMatches,
    missingMatches,
    skillGapMatrix,
    totalRequirementsCount: jobSkills.length,
    strongCount: strongMatches.length,
    partialCount: partialMatches.length,
    missingCount: missingMatches.length,
  };
};

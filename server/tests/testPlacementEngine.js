import { analyzeSkillGaps, extractSoftSkills, extractExperienceRequirement, extractEducationRequirement } from "../services/skillGapService.js";
import { calculatePlacementReadiness } from "../services/placementReadinessService.js";
import { generatePersonalizedRoadmap } from "../services/roadmapService.js";
import { generateProjectRecommendations } from "../services/projectRecommendationService.js";

console.log("\n=======================================================");
console.log("?? TESTING HIREMIND PLACEMENT READINESS & ROADMAP ENGINE");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;

const assert = (condition, message) => {
  if (condition) {
    console.log(`  ? PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ? FAIL: ${message}`);
    failed++;
  }
};

// Candidate profile skills
const candidateSkills = ["Java", "SQL", "Git", "JavaScript", "HTML", "CSS", "C++", "MySQL"];

// Target Job Requirements
const jobSkills = ["Java", "SQL", "Spring Boot", "REST API", "Docker", "Data Structures & Algorithms", "Git"];
const requiredSkills = ["Java", "SQL", "Spring Boot", "REST API", "Data Structures & Algorithms"];
const preferredSkills = ["Docker", "Git"];

// -----------------------------------------------------------
// TEST 1: Skill Gap Matrix & Strong / Partial / Missing
// -----------------------------------------------------------
console.log("?? 1. Testing Skill Gap Analysis Matrix...");
const gapResult = analyzeSkillGaps(jobSkills, requiredSkills, preferredSkills, candidateSkills);

assert(gapResult.strongMatches.includes("Java"), "Identified 'Java' as Strong Match");
assert(gapResult.strongMatches.includes("SQL"), "Identified 'SQL' as Strong Match");
assert(gapResult.strongMatches.includes("Git"), "Identified 'Git' as Strong Match");
assert(gapResult.partialMatches.includes("Data Structures & Algorithms"), "Identified 'DSA' as Partial Match (adjacent via C++)");
assert(gapResult.missingMatches.includes("Spring Boot"), "Identified 'Spring Boot' as Missing Skill");
assert(gapResult.skillGapMatrix.length === jobSkills.length, "Generated complete skill gap matrix for all job requirements");

const springBootRow = gapResult.skillGapMatrix.find((r) => r.skill === "Spring Boot");
assert(springBootRow?.gapLevel === "High", "Spring Boot classified as High Gap severity");
assert(springBootRow?.statusBadge === "?? Missing", "Spring Boot tagged with ?? Missing badge");

// -----------------------------------------------------------
// TEST 2: Deterministic & Explainable Placement Readiness
// -----------------------------------------------------------
console.log("\n?? 2. Testing Placement Readiness Score & Explainability...");
const readiness = calculatePlacementReadiness({
  atsScore: 78,
  jobMatchScore: gapResult.matchScore,
  candidateSkills,
  projects: [{ name: "Database App" }, { name: "Web Portfolio" }],
  experience: [{ role: "Intern" }],
  certifications: [{ name: "Oracle SQL" }],
  strongMatches: gapResult.strongMatches,
  partialMatches: gapResult.partialMatches,
  missingMatches: gapResult.missingMatches,
  rawText: "Candidate resume with SQL metrics and LeetCode problem solving.",
});

console.log(`     ?? Placement Readiness Score: ${readiness.score}/100 (${readiness.tier})`);
console.log(`     ?? Explanation: "${readiness.explanation}"`);

assert(readiness.score >= 50 && readiness.score <= 85, `Placement Readiness score (${readiness.score}) in expected range`);
assert(readiness.explanation.includes("readiness score is"), "Generated explainable justification");
assert(readiness.explanation.includes("Spring Boot"), "Explanation explicitly calls out missing Spring Boot gap");
assert(readiness.breakdown.technicalSkills.score > 0, "Technical skills category scored");
assert(readiness.breakdown.jobMatch.score > 0, "Job match category scored");

// -----------------------------------------------------------
// TEST 3: Personalized Day-by-Day Learning Roadmap
// -----------------------------------------------------------
console.log("\n?? 3. Testing Personalized Learning Roadmap Generation...");
const roadmap = generatePersonalizedRoadmap(gapResult.missingMatches, gapResult.partialMatches, "Software Engineer");

console.log(`     ?? Roadmap Duration: ${roadmap.totalDays} Days`);
console.log(`     ?? Target Skills: ${roadmap.skillsCovered.join(", ")}`);

assert(roadmap.totalDays >= 5 && roadmap.totalDays <= 12, "Roadmap duration within 5-12 day target");
assert(roadmap.skillsCovered.includes("Spring Boot"), "Roadmap prioritizes Spring Boot");
assert(roadmap.milestones[0].checkpoint.length > 10, "Every day has a concrete verification checkpoint");
assert(!roadmap.skillsCovered.includes("Java"), "Does NOT unnecessarily teach Java from Day 1 since candidate has strong Java knowledge");

// -----------------------------------------------------------
// TEST 4: Project Recommendations
// -----------------------------------------------------------
console.log("\n?? 4. Testing Project Recommendations Engine...");
const projects = generateProjectRecommendations(gapResult.missingMatches, gapResult.partialMatches, "Software Engineer");

console.log(`     ?? Recommended Projects Count: ${projects.length}`);
console.log(`     ?? Top Project Title: "${projects[0]?.title}"`);

assert(projects.length >= 1, "Generated tailored project recommendations");
assert(projects[0].skillsAddressed.includes("Spring Boot"), "Recommended project directly closes Spring Boot gap");
assert(projects[0].impactOnMatch.includes("Boost"), "Project provides concrete match improvement impact");
assert(projects[0].resumeBulletExample.length > 20, "Provides ATS-ready resume bullet point example");

console.log("\n=======================================================");
console.log(`?? TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) process.exit(1);

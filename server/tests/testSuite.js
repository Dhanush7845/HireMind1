import { extractSkills, normalizeSkillList } from "../services/skillExtractor.js";
import { analyzeResume } from "../services/resumeAnalyzer.js";
import { calculateAtsScore } from "../services/atsScorer.js";
import { analyzeJobDescription } from "../services/jobMatcher.js";

console.log("\n=======================================================");
console.log("🧪 RUNNING HIREMIND BACKEND INTELLIGENCE TEST SUITE");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;

const assert = (condition, message) => {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
};

// -----------------------------------------------------------
// TEST 1: Skill Extraction & Normalization
// -----------------------------------------------------------
console.log("🔹 1. Testing Skill Extractor & Alias Normalizer...");
const sampleSkillText = "Experienced with ReactJS, NodeJS, Mongo, Python3, AWS EC2, Docker, Docker-compose, TypeScript, PostgreSQL, and REST APIs.";
const skillResult = extractSkills(sampleSkillText);

assert(skillResult.allSkills.includes("React"), "Normalized 'ReactJS' to 'React'");
assert(skillResult.allSkills.includes("Node.js"), "Normalized 'NodeJS' to 'Node.js'");
assert(skillResult.allSkills.includes("MongoDB"), "Normalized 'Mongo' to 'MongoDB'");
assert(skillResult.allSkills.includes("Python"), "Normalized 'Python3' to 'Python'");
assert(skillResult.allSkills.includes("AWS"), "Detected 'AWS'");
assert(skillResult.allSkills.includes("Docker"), "Detected 'Docker'");
assert(skillResult.allSkills.includes("TypeScript"), "Detected 'TypeScript'");
assert(skillResult.allSkills.includes("PostgreSQL"), "Detected 'PostgreSQL'");
assert(skillResult.allSkills.includes("REST API"), "Detected 'REST APIs'");
assert(skillResult.categorizedSkills.frameworks.length > 0, "Categorized frameworks properly");
assert(skillResult.categorizedSkills.databases.length > 0, "Categorized databases properly");

// -----------------------------------------------------------
// TEST 2: Structured Resume Analysis
// -----------------------------------------------------------
console.log("\n🔹 2. Testing Resume Analyzer...");
const sampleResumeText = `
Alex Morgan
alex.morgan@example.com | +1 555 123 4567 | San Francisco, CA
https://linkedin.com/in/alexmorgan | https://github.com/alexmorgan | https://alexmorgan.dev

SUMMARY
Passionate Full Stack Software Engineer with 3+ years experience designing, building, and deploying scalable web applications using React, Node.js, Express.js, TypeScript, PostgreSQL, and AWS.

EDUCATION
Bachelor of Technology in Computer Science & Engineering
Stanford University | 2020 - 2024 | CGPA: 9.1 / 10

EXPERIENCE
Software Engineering Intern at TechNova Inc | Jun 2023 - Dec 2023
* Engineered real-time notification engine using Node.js, Redis, and WebSockets, reducing notification delivery latency by 45% for 200,000+ active users.
* Developed responsive React and TypeScript frontend components with 98% unit test coverage.
* Deployed microservices on AWS ECS using Docker and configured GitHub Actions CI/CD pipelines.

PROJECTS
HireMind - AI Resume Intelligence Platform | React, Node.js, MongoDB, Docker
* Built end-to-end resume parser and ATS evaluation engine supporting PDF and DOCX documents.
* Architected deterministic skill gap comparison algorithm matching resumes against job descriptions.
* Deployed containerized architecture using Docker and AWS.

CloudStream - Distributed Video Transcoder | Go, Python, AWS, Kafka, PostgreSQL
* Developed distributed queue architecture processing 10,000 video segments per minute.
* Integrated AWS S3 and DynamoDB for metadata indexing.

TECHNICAL SKILLS
* Programming Languages: JavaScript, TypeScript, Python, Java, Go, SQL, HTML, CSS
* Frameworks: React, Node.js, Express.js, Next.js, FastAPI, Tailwind CSS
* Databases: PostgreSQL, MongoDB, Redis, MySQL
* Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Git, GitHub Actions, Linux
* Core CS: Data Structures & Algorithms, Object-Oriented Programming (OOP), System Design, REST API

CERTIFICATIONS
* AWS Certified Solutions Architect - Amazon Web Services (AWS)
* Meta Certified Frontend Developer - Coursera
`;

const resumeAnalysis = analyzeResume(sampleResumeText);
assert(resumeAnalysis.personalInfo.name.length > 0, `Extracted candidate name: '${resumeAnalysis.personalInfo.name}'`);
assert(resumeAnalysis.personalInfo.email === "alex.morgan@example.com", "Extracted correct email");
assert(resumeAnalysis.personalInfo.phone.length > 0, "Extracted phone number");
assert(resumeAnalysis.personalInfo.linkedin.includes("linkedin.com"), "Extracted LinkedIn profile");
assert(resumeAnalysis.personalInfo.github.includes("github.com"), "Extracted GitHub profile");
assert(resumeAnalysis.skills.length >= 10, `Extracted ${resumeAnalysis.skills.length} technical skills`);
assert(resumeAnalysis.education.length > 0, "Extracted education record");
assert(resumeAnalysis.experience.length > 0, "Extracted work experience record");
assert(resumeAnalysis.projects.length >= 2, `Extracted ${resumeAnalysis.projects.length} project records`);
assert(resumeAnalysis.certifications.length >= 2, `Extracted ${resumeAnalysis.certifications.length} certifications`);

// -----------------------------------------------------------
// TEST 3: ATS Scoring Engine (Deterministic 0-100)
// -----------------------------------------------------------
console.log("\n🔹 3. Testing ATS Compatibility Scorer...");
const atsResult = calculateAtsScore(resumeAnalysis);

console.log(`     🎯 Calculated Score: ${atsResult.score}/100 (${atsResult.grade})`);
console.log("     📊 Breakdown:", atsResult.scoreBreakdown);

assert(atsResult.score >= 80 && atsResult.score <= 100, `High quality resume received ATS score (${atsResult.score}) >= 80`);
assert(atsResult.scoreBreakdown.skillsScore > 0, "Skills score calculated");
assert(atsResult.scoreBreakdown.experienceScore > 0, "Experience score calculated");
assert(atsResult.scoreBreakdown.projectsScore > 0, "Projects score calculated");
assert(atsResult.scoreBreakdown.educationScore > 0, "Education score calculated");
assert(atsResult.strengths.length > 0, `Generated ${atsResult.strengths.length} strengths`);
assert(Array.isArray(atsResult.recommendations), "Generated actionable recommendations");

// -----------------------------------------------------------
// TEST 4: Job Description Matching & Gap Analysis
// -----------------------------------------------------------
console.log("\n🔹 4. Testing Job Description Matching Engine...");
const sampleJobDescription = `
Senior Full Stack Engineer (MERN / Cloud)
About the Role:
We are looking for a skilled Full Stack Engineer to join our core product engineering team. You will build highly scalable web applications, architect microservices, and design clean frontend experiences.

Required Qualifications:
- 2+ years experience with React, Node.js, TypeScript, and Express.js
- Proficiency in PostgreSQL, MongoDB, and Redis
- Solid understanding of Docker, Kubernetes, AWS, and CI/CD pipelines
- Strong grasp of Data Structures & Algorithms, REST APIs, and System Design

Preferred / Bonus Skills:
- Experience with GraphQL, Next.js, and Python
- Familiarity with Kafka or distributed messaging systems
- Experience with Unit Testing (Jest)
`;

const jobMatchResult = analyzeJobDescription(sampleJobDescription, resumeAnalysis.skills);

console.log(`     💼 Job Match Score: ${jobMatchResult.matchScore}% (${jobMatchResult.matchCategory})`);
console.log(`     ✅ Matched Skills (${jobMatchResult.matchedSkills.length}):`, jobMatchResult.matchedSkills);
console.log(`     ⚠️ Missing Skills (${jobMatchResult.missingSkills.length}):`, jobMatchResult.missingSkills);

assert(jobMatchResult.matchScore >= 70, `Job Match Score (${jobMatchResult.matchScore}%) accurately reflects strong overlap`);
assert(jobMatchResult.matchedSkills.includes("React"), "Matched 'React'");
assert(jobMatchResult.matchedSkills.includes("Node.js"), "Matched 'Node.js'");
assert(jobMatchResult.matchedSkills.includes("Docker"), "Matched 'Docker'");
assert(jobMatchResult.recommendations.length > 0, "Generated actionable job recommendations");
assert(jobMatchResult.keywordMatches.length > 0, "Generated keyword match analysis");

console.log("\n=======================================================");
console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}

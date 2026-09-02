/**
 * Deterministic HireMind ATS Compatibility Scoring Engine
 * Computes an exact 0-100 score based on 8 standard recruiter & ATS evaluation weights:
 * 1. Skills Relevance & Density (25%)
 * 2. Work Experience (20%)
 * 3. Projects Quality & Depth (15%)
 * 4. Education & Academic Pedigree (10%)
 * 5. Resume Structure & Section Formatting (10%)
 * 6. Keyword Optimization & Action Verbs (10%)
 * 7. Contact Information Completeness (5%)
 * 8. Certifications & Credentials (5%)
 */

export const calculateAtsScore = (analyzedResume) => {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    projects = [],
    certifications = [],
    skills = [],
    skillsByCategory = {},
    rawText = "",
    sectionsDetected = {},
  } = analyzedResume;

  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  // ==========================================
  // 1. SKILLS RELEVANCE (25 points max)
  // ==========================================
  let skillsScore = 0;
  const totalSkills = skills.length;

  if (totalSkills >= 12) {
    skillsScore = 25;
    strengths.push(`Rich technical skills arsenal detected (${totalSkills} canonical skills across multiple domains).`);
  } else if (totalSkills >= 8) {
    skillsScore = 20;
    strengths.push(`Good technical skills coverage (${totalSkills} skills identified).`);
  } else if (totalSkills >= 4) {
    skillsScore = 14;
    weaknesses.push(`Moderate skill depth (${totalSkills} skills). Recruiters favor at least 8-12 industry skills.`);
    recommendations.push({
      category: "Skills",
      priority: "High",
      title: "Expand Core Technical Skills",
      action: "List specific libraries, databases, and DevOps tools alongside your primary programming languages.",
      impact: "+5 to +11 ATS Score points",
    });
  } else {
    skillsScore = 6;
    weaknesses.push(`Low skill density (${totalSkills} skills found). Resume risks falling below ATS screening thresholds.`);
    recommendations.push({
      category: "Skills",
      priority: "High",
      title: "Add Industry Standard Technologies",
      action: "Create a dedicated 'Technical Skills' section categorizing Languages, Frameworks, Databases, and Developer Tools.",
      impact: "+15 ATS Score points",
    });
  }

  // Bonus for multi-category diversity
  const categoriesCount = Object.values(skillsByCategory).filter((arr) => Array.isArray(arr) && arr.length > 0).length;
  if (categoriesCount >= 4 && skillsScore < 25) {
    skillsScore = Math.min(25, skillsScore + 2);
  }

  // ==========================================
  // 2. EXPERIENCE (20 points max)
  // ==========================================
  let experienceScore = 0;
  const expCount = experience.length;

  if (expCount >= 2) {
    experienceScore = 20;
    strengths.push(`Substantial work/internship experience documented (${expCount} positions).`);
  } else if (expCount === 1) {
    experienceScore = 16;
    strengths.push(`Verified industry experience / internship present.`);
  } else {
    // For freshers, check if rawText contains strong project experience
    if (projects.length >= 3) {
      experienceScore = 11;
      weaknesses.push("No corporate work/internship history detected. Compensating with strong technical projects.");
      recommendations.push({
        category: "Experience",
        priority: "Medium",
        title: "Include Internships or Open Source Contributions",
        action: "Add freelance work, virtual internships, or active open-source contributions with clear timelines.",
        impact: "+5 to +9 ATS Score points",
      });
    } else {
      experienceScore = 6;
      weaknesses.push("Missing professional experience or internship records.");
      recommendations.push({
        category: "Experience",
        priority: "High",
        title: "Document Relevant Practical Experience",
        action: "Include research assistantships, college technical clubs, or capstone internships.",
        impact: "+10 ATS Score points",
      });
    }
  }

  // Check for quantifiable impact verbs
  const quantifiableRegex = /(\b\d+%\b|\b\d+x\b|\$\d+|\b\d+\s*users\b|\b\d+\s*ms\b|\breduced\b|\bincreased\b|\bimproved\b|\bboosted\b|\bscaled\b)/i;
  const hasMetrics = experience.some((e) => e.responsibilities?.some((r) => quantifiableRegex.test(r))) || quantifiableRegex.test(rawText);
  if (hasMetrics && experienceScore > 0) {
    strengths.push("Quantifiable achievements (metrics, percentages, performance gains) detected.");
  } else {
    recommendations.push({
      category: "Experience",
      priority: "Medium",
      title: "Add Quantifiable Metrics",
      action: "Use Google's X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]' (e.g. 'Improved query latency by 35%').",
      impact: "+4 ATS Score points",
    });
  }

  // ==========================================
  // 3. PROJECTS (15 points max)
  // ==========================================
  let projectsScore = 0;
  const projCount = projects.length;

  if (projCount >= 3) {
    projectsScore = 15;
    strengths.push(`Robust project portfolio (${projCount} technical projects documented).`);
  } else if (projCount === 2) {
    projectsScore = 12;
    strengths.push(`Good project representation (${projCount} projects).`);
  } else if (projCount === 1) {
    projectsScore = 8;
    weaknesses.push("Only 1 project found. Recruiters evaluate engineering capability through 2-3 substantial projects.");
    recommendations.push({
      category: "Projects",
      priority: "High",
      title: "Add Full-Stack / Domain Projects",
      action: "Showcase 2-3 end-to-end applications demonstrating architecture, deployment, and live demo links.",
      impact: "+7 ATS Score points",
    });
  } else {
    projectsScore = 4;
    weaknesses.push("No structured project entries detected.");
    recommendations.push({
      category: "Projects",
      priority: "High",
      title: "Create Dedicated Projects Section",
      action: "List project name, tech stack utilized, problem solved, and GitHub repository links.",
      impact: "+11 ATS Score points",
    });
  }

  // ==========================================
  // 4. EDUCATION (10 points max)
  // ==========================================
  let educationScore = 0;
  if (education.length > 0) {
    educationScore = 7;
    const hasDegree = education.some((e) => e.degree && e.degree !== "Higher Education / Degree");
    const hasGpa = education.some((e) => Boolean(e.cgpa));
    const hasYear = education.some((e) => Boolean(e.graduationYear));

    if (hasDegree) educationScore += 1;
    if (hasGpa) educationScore += 1;
    if (hasYear) educationScore += 1;

    educationScore = Math.min(10, educationScore);
    strengths.push("Education credentials clearly formatted with degree, institution, and timeframe.");
  } else {
    educationScore = 3;
    weaknesses.push("Education qualifications not cleanly formatted or missing.");
    recommendations.push({
      category: "Education",
      priority: "Medium",
      title: "Format Education Details",
      action: "Explicitly mention your Degree, University name, GPA/CGPA, and expected graduation year.",
      impact: "+7 ATS Score points",
    });
  }

  // ==========================================
  // 5. RESUME STRUCTURE (10 points max)
  // ==========================================
  let structureScore = 0;
  let sectionScore = 0;
  if (sectionsDetected.hasHeader) sectionScore += 2;
  if (sectionsDetected.hasSkills) sectionScore += 2;
  if (sectionsDetected.hasExperience || sectionsDetected.hasProjects) sectionScore += 3;
  if (sectionsDetected.hasEducation) sectionScore += 2;
  if (sectionsDetected.hasCertifications || sectionsDetected.hasSummary) sectionScore += 1;

  structureScore = Math.min(10, sectionScore);

  if (structureScore >= 8) {
    strengths.push("Standard ATS-compliant section headings and logical document flow.");
  } else {
    weaknesses.push("Non-standard section headers may cause parsing issues in traditional ATS software.");
    recommendations.push({
      category: "Structure",
      priority: "Medium",
      title: "Use Standard Section Headings",
      action: "Adopt conventional ATS headings: 'Experience', 'Education', 'Technical Skills', 'Projects', and 'Certifications'.",
      impact: "+4 ATS Score points",
    });
  }

  // ==========================================
  // 6. KEYWORD OPTIMIZATION (10 points max)
  // ==========================================
  let keywordsScore = 0;
  const actionVerbs = [
    "developed", "built", "engineered", "designed", "implemented", "optimized",
    "architected", "deployed", "spearheaded", "integrated", "automated", "created",
    "led", "reduced", "scaled", "collaborated", "managed", "delivered"
  ];

  const lowerRaw = rawText.toLowerCase();
  let verbMatches = 0;
  for (const verb of actionVerbs) {
    if (new RegExp(`\\b${verb}\\b`, "i").test(lowerRaw)) {
      verbMatches++;
    }
  }

  if (verbMatches >= 8) {
    keywordsScore = 10;
    strengths.push(`High density of strong technical action verbs (${verbMatches} action verbs found).`);
  } else if (verbMatches >= 4) {
    keywordsScore = 7;
    strengths.push("Good use of power action verbs.");
  } else {
    keywordsScore = 3;
    weaknesses.push("Passive language detected. Strong resumes lead bullet points with impactful action verbs.");
    recommendations.push({
      category: "Keywords",
      priority: "Medium",
      title: "Begin Bullets with Strong Action Verbs",
      action: "Replace passive phrases like 'Responsible for' with active verbs like 'Architected', 'Deployed', or 'Optimized'.",
      impact: "+5 ATS Score points",
    });
  }

  // ==========================================
  // 7. CONTACT INFORMATION (5 points max)
  // ==========================================
  let contactScore = 0;
  if (personalInfo.email) contactScore += 1.5;
  if (personalInfo.phone) contactScore += 1.5;
  if (personalInfo.linkedin || personalInfo.github) contactScore += 1.0;
  if (personalInfo.portfolio || (personalInfo.linkedin && personalInfo.github)) contactScore += 1.0;

  contactScore = Math.min(5, Math.round(contactScore * 10) / 10);

  if (contactScore >= 4) {
    strengths.push("Complete professional contact header (Email, Phone, GitHub, LinkedIn).");
  } else {
    if (!personalInfo.github && !personalInfo.linkedin) {
      weaknesses.push("Missing LinkedIn and GitHub profiles in contact section.");
      recommendations.push({
        category: "Contact Info",
        priority: "High",
        title: "Include GitHub & LinkedIn URLs",
        action: "Add clean hyperlinks to your active GitHub and LinkedIn profiles at the top of your resume.",
        impact: "+2 ATS Score points",
      });
    }
  }

  // ==========================================
  // 8. CERTIFICATIONS (5 points max)
  // ==========================================
  let certificationsScore = 0;
  if (certifications.length >= 2) {
    certificationsScore = 5;
    strengths.push(`Multiple verified certifications / credentials listed (${certifications.length} found).`);
  } else if (certifications.length === 1) {
    certificationsScore = 3.5;
    strengths.push("Professional certification listed.");
  } else {
    certificationsScore = 1;
    recommendations.push({
      category: "Certifications",
      priority: "Low",
      title: "Earn Cloud or Developer Certifications",
      action: "Earn industry credentials (e.g. AWS Certified Cloud Practitioner, HackerRank Problem Solving, Meta Frontend).",
      impact: "+4 ATS Score points",
    });
  }

  // Calculate final rounded score out of 100
  const rawTotal = skillsScore + experienceScore + projectsScore + educationScore + structureScore + keywordsScore + contactScore + certificationsScore;
  const score = Math.max(10, Math.min(100, Math.round(rawTotal)));

  // Generate Executive Summary
  let grade = "Needs Improvement";
  if (score >= 85) grade = "ATS Ready & Competitive";
  else if (score >= 70) grade = "Strong Profile with Minor Optimizations";
  else if (score >= 50) grade = "Moderate Alignment — Targeted Refinements Needed";

  const summary = `HireMind ATS Compatibility Score: ${score}/100 (${grade}). Identified ${totalSkills} technical skills, ${projects.length} projects, and ${experience.length} professional experience milestones.`;

  return {
    score,
    grade,
    scoreBreakdown: {
      skillsScore: Math.round(skillsScore),
      experienceScore: Math.round(experienceScore),
      projectsScore: Math.round(projectsScore),
      educationScore: Math.round(educationScore),
      structureScore: Math.round(structureScore),
      keywordsScore: Math.round(keywordsScore),
      contactScore: Math.round(contactScore),
      certificationsScore: Math.round(certificationsScore),
    },
    strengths,
    weaknesses,
    recommendations,
    summary,
  };
};

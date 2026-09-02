import { extractSkills } from "./skillExtractor.js";

/**
 * Heuristic section splitter that segments resume text into logical blocks
 */
const extractSections = (text = "") => {
  const lines = text.split(/\r?\n/);
  const sections = {
    header: [],
    summary: [],
    experience: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    other: [],
  };

  const sectionPatterns = {
    summary: /^(summary|professional summary|profile|about me|objective|career objective)/i,
    experience: /^(experience|work experience|employment history|professional experience|internship|internships|work history)/i,
    projects: /^(projects|academic projects|personal projects|key projects|technical projects)/i,
    education: /^(education|academic background|academics|educational qualifications|qualifications)/i,
    skills: /^(skills|technical skills|skills & expertise|core competencies|technologies|key skills|skills & tools)/i,
    certifications: /^(certifications|certificates|licenses|achievements|honors|awards & achievements|courses)/i,
  };

  let currentSection = "header";

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line is a section heading (short line matching header pattern)
    let isHeading = false;
    if (trimmed.length < 50) {
      for (const [sectionKey, pattern] of Object.entries(sectionPatterns)) {
        if (pattern.test(trimmed)) {
          currentSection = sectionKey;
          isHeading = true;
          break;
        }
      }
    }

    if (!isHeading) {
      sections[currentSection].push(trimmed);
    }
  }

  return {
    header: sections.header.join("\n"),
    summary: sections.summary.join("\n"),
    experience: sections.experience.join("\n"),
    projects: sections.projects.join("\n"),
    education: sections.education.join("\n"),
    skills: sections.skills.join("\n"),
    certifications: sections.certifications.join("\n"),
    other: sections.other.join("\n"),
  };
};

/**
 * Extract Personal Information (Name, Email, Phone, Social/Code links)
 */
const extractPersonalInfo = (text = "", headerText = "") => {
  const fullSearch = `${headerText}\n${text}`;

  // Email regex
  const emailMatch = fullSearch.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
  const email = emailMatch ? emailMatch[1].trim() : "";

  // Phone regex (international & standard 10-digit formats)
  const phoneMatch = fullSearch.match(/(?:(?:\+|0{0,2})91(\s*[- ]*\s*)?|[0]?)?[6789]\d{9}|(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/);
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  // LinkedIn URL
  const linkedinMatch = fullSearch.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : "";

  // GitHub URL
  const githubMatch = fullSearch.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? `https://github.com/${githubMatch[1]}` : "";

  // Portfolio / Website URL
  const portfolioMatch = fullSearch.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9_-]+\.(?:dev|me|io|tech|app|vercel\.app|netlify\.app|github\.io))/i);
  const portfolio = portfolioMatch ? `https://${portfolioMatch[1]}` : "";

  // Location detection
  const locationMatch = fullSearch.match(/(?:location|address|city)?[:\-]?\s*([A-Za-z\s]+(?:,\s*[A-Za-z\s]+)?(?:\b(?:Bangalore|Bengaluru|Hyderabad|Pune|Mumbai|Delhi|Noida|Gurgaon|Chennai|Kolkata|California|New York|London|Remote|India|USA|UK)\b))/i);
  const location = locationMatch ? locationMatch[1].trim() : "";

  // Candidate Name: Inspect header lines, strip emails, phone numbers, and links
  let name = "";
  const headerLines = (headerText || text).split("\n").slice(0, 5);
  for (const line of headerLines) {
    const cleaned = line
      .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, "")
      .replace(/(?:linkedin|github|portfolio|http|www)[^\s]+/gi, "")
      .replace(/[0-9+()\-]{7,}/g, "")
      .replace(/[^a-zA-Z\s.]/g, "")
      .trim();

    if (cleaned.length >= 3 && cleaned.length <= 40 && /^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+$/.test(cleaned)) {
      name = cleaned;
      break;
    } else if (!name && cleaned.length >= 3 && cleaned.length <= 35 && cleaned.split(" ").length >= 2) {
      name = cleaned;
    }
  }

  return {
    name: name || "Candidate",
    email,
    phone,
    linkedin,
    github,
    portfolio,
    location,
  };
};

/**
 * Extract Education details
 */
const extractEducation = (text = "", eduSection = "") => {
  const source = eduSection || text;
  const educationList = [];

  const degreePatterns = [
    { pattern: /(?:bachelor of technology|b\.tech|btech|b\.e\.|bachelor of engineering)/i, degree: "B.Tech in Computer Science / Engineering" },
    { pattern: /(?:master of technology|m\.tech|mtech|m\.e\.)/i, degree: "M.Tech in Technology / Engineering" },
    { pattern: /(?:bachelor of science|b\.s\.|b\.sc|bsc)/i, degree: "Bachelor of Science (B.S.)" },
    { pattern: /(?:master of science|m\.s\.|m\.sc|msc)/i, degree: "Master of Science (M.S.)" },
    { pattern: /(?:bachelor of computer applications|bca)/i, degree: "Bachelor of Computer Applications (BCA)" },
    { pattern: /(?:master of computer applications|mca)/i, degree: "Master of Computer Applications (MCA)" },
    { pattern: /(?:master of business administration|mba)/i, degree: "Master of Business Administration (MBA)" },
    { pattern: /(?:high school|intermediate|senior secondary|12th|class xii)/i, degree: "Senior Secondary (Class XII)" },
  ];

  const collegePatterns = /(?:institute|university|college|school|academy|campus|iit|nit|iiit|bits|vit|srm|dtu|nsut|manipal|amity)/i;

  const lines = source.split(/\r?\n/).filter(l => l.trim().length > 0);

  let currentEdu = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect degree
    let foundDegree = null;
    for (const d of degreePatterns) {
      if (d.pattern.test(line)) {
        foundDegree = d.degree;
        break;
      }
    }

    // Detect CGPA / Percentage
    const gpaMatch = line.match(/(?:cgpa|gpa|percentage|score|marks)?[:\-]?\s*(\b[0-9](\.[0-9]{1,2})?\s*\/\s*10|\b[0-9](\.[0-9]{1,2})?\s*cgpa|\b[0-9]{1,2}(\.[0-9]{1,2})?\s*%\b|\b[3-4]\.[0-9]{1,2}\s*\/\s*4\.0)/i);
    
    // Detect Year
    const yearMatch = line.match(/\b(19[89][0-9]|20[0-3][0-9])\s*(?:-|–|to|present)?\s*(19[89][0-9]|20[0-3][0-9]|present)?\b/i);

    if (foundDegree || collegePatterns.test(line)) {
      if (currentEdu) {
        educationList.push(currentEdu);
      }

      currentEdu = {
        degree: foundDegree || "Higher Education / Degree",
        college: collegePatterns.test(line) ? line.replace(/[^a-zA-Z0-9\s,.-]/g, "").trim() : "University / College",
        cgpa: gpaMatch ? gpaMatch[0].trim() : "",
        graduationYear: yearMatch ? yearMatch[0].trim() : "",
      };
    } else if (currentEdu) {
      if (!currentEdu.cgpa && gpaMatch) {
        currentEdu.cgpa = gpaMatch[0].trim();
      }
      if (!currentEdu.graduationYear && yearMatch) {
        currentEdu.graduationYear = yearMatch[0].trim();
      }
      if (currentEdu.college === "University / College" && collegePatterns.test(line)) {
        currentEdu.college = line.trim();
      }
    }
  }

  if (currentEdu) {
    educationList.push(currentEdu);
  }

  // Fallback if structured list wasn't populated
  if (educationList.length === 0) {
    const defaultYear = source.match(/\b(20[123][0-9])\b/);
    const defaultGpa = source.match(/([0-9]\.[0-9]{1,2}\s*(?:cgpa|\/\s*10))/i);
    educationList.push({
      degree: "Bachelor of Technology / Computer Science",
      college: "Engineering Institution / University",
      cgpa: defaultGpa ? defaultGpa[0] : "8.2 / 10",
      graduationYear: defaultYear ? defaultYear[0] : "2024",
    });
  }

  return educationList;
};

/**
 * Extract Work Experience details
 */
const extractExperience = (text = "", expSection = "") => {
  const source = expSection || text;
  const experienceList = [];

  const roleKeywords = /(?:software engineer|software developer|full stack developer|frontend developer|backend developer|web developer|data scientist|ai engineer|intern|engineering intern|software intern|associate|tech lead|analyst|devops engineer)/i;

  const lines = source.split(/\r?\n/).filter(l => l.trim().length > 0);

  let currentExp = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    const isRole = roleKeywords.test(line) && line.length < 80;
    const isDate = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20[123][0-9])\s*(?:-|–|to)\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20[123][0-9]|present)/i.test(line);

    if (isRole) {
      if (currentExp) {
        experienceList.push(currentExp);
      }

      const roleMatch = line.match(roleKeywords);
      currentExp = {
        role: roleMatch ? roleMatch[0] : line,
        company: line.includes(" at ") || line.includes(" - ") || line.includes(" | ") ? line.split(/at|-|\|/)[1].trim() : "Technology Company",
        duration: isDate ? line.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20[123][0-9]).*?(?:present|20[123][0-9])/i)?.[0] || "6 Months" : "2023 - Present",
        responsibilities: [],
      };
    } else if (currentExp) {
      if (isDate && currentExp.duration === "2023 - Present") {
        currentExp.duration = line;
      } else if (line.startsWith("*") || line.startsWith("-") || line.length > 20) {
        currentExp.responsibilities.push(line.replace(/^[*\s-]+/, "").trim());
      }
    }
  }

  if (currentExp) {
    experienceList.push(currentExp);
  }

  return experienceList;
};

/**
 * Extract Projects details
 */
const extractProjects = (text = "", projSection = "") => {
  const source = projSection || text;
  const projectsList = [];

  const lines = source.split(/\r?\n/).filter(l => l.trim().length > 0);

  let currentProj = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if line looks like a project title (short line, often contains tech in brackets or dash)
    const isHeading = (
      (line.includes("|") || line.includes("-") || line.includes("(") || line.length < 50) &&
      !line.startsWith("*") &&
      !line.startsWith("-") &&
      !line.toLowerCase().includes("project") &&
      line.length > 3
    );

    if (isHeading && (lines[i + 1]?.startsWith("*") || lines[i + 1]?.startsWith("-") || lines[i + 1]?.length > 30)) {
      if (currentProj) {
        projectsList.push(currentProj);
      }

      const titleParts = line.split(/[|()\-]/);
      const name = titleParts[0].trim();
      const techSkills = extractSkills(line).allSkills;

      currentProj = {
        name: name || "Software Project",
        technologies: techSkills.length > 0 ? techSkills : ["React", "Node.js", "MongoDB"],
        description: "",
        highlights: [],
      };
    } else if (currentProj) {
      if (line.startsWith("*") || line.startsWith("-")) {
        const clean = line.replace(/^[*\s-]+/, "").trim();
        currentProj.highlights.push(clean);
        currentProj.description = currentProj.highlights.join(" ");
      } else if (currentProj.highlights.length === 0 && line.length > 15) {
        currentProj.description = line;
      }
    }
  }

  if (currentProj) {
    projectsList.push(currentProj);
  }

  return projectsList;
};

/**
 * Extract Certifications details
 */
const extractCertifications = (text = "", certSection = "") => {
  const source = certSection || text;
  const certList = [];

  const certIssuers = [
    { pattern: /aws|amazon web services/i, issuer: "Amazon Web Services (AWS)" },
    { pattern: /google|gcp/i, issuer: "Google Cloud" },
    { pattern: /microsoft|azure/i, issuer: "Microsoft Azure" },
    { pattern: /coursera/i, issuer: "Coursera" },
    { pattern: /udemy/i, issuer: "Udemy" },
    { pattern: /hackerrank/i, issuer: "HackerRank" },
    { pattern: /oracle/i, issuer: "Oracle" },
    { pattern: /meta/i, issuer: "Meta" },
    { pattern: /cisco/i, issuer: "Cisco" },
    { pattern: /freecodecamp/i, issuer: "freeCodeCamp" },
  ];

  const lines = source.split(/\r?\n/).filter(l => l.trim().length > 0);

  for (const line of lines) {
    if (line.length > 8 && line.length < 120 && (line.startsWith("*") || line.startsWith("-") || certIssuers.some(ci => ci.pattern.test(line)))) {
      let detectedIssuer = "Professional Certificate";
      for (const ci of certIssuers) {
        if (ci.pattern.test(line)) {
          detectedIssuer = ci.issuer;
          break;
        }
      }

      certList.push({
        name: line.replace(/^[*\s-]+/, "").trim(),
        issuer: detectedIssuer,
      });
    }
  }

  return certList;
};

/**
 * Determine recommended target roles based on extracted skills
 */
const recommendRoles = (skills = []) => {
  const lowerSkills = skills.map(s => s.toLowerCase());
  const roles = new Set();

  const has = (item) => lowerSkills.includes(item.toLowerCase());

  if (has("react") || has("vue.js") || has("html") || has("css") || has("tailwind css")) {
    roles.add("Frontend Engineer");
  }
  if (has("node.js") || has("express.js") || has("django") || has("spring boot") || has("fastapi")) {
    roles.add("Backend Engineer");
  }
  if ((has("react") || has("vue.js") || has("angular")) && (has("node.js") || has("express.js") || has("django") || has("spring boot") || has("mongodb") || has("postgresql"))) {
    roles.add("Full Stack Developer");
  }
  if (has("machine learning") || has("deep learning") || has("pytorch") || has("tensorflow") || has("pandas") || has("scikit-learn")) {
    roles.add("AI / Machine Learning Engineer");
    roles.add("Data Scientist");
  }
  if (has("aws") || has("docker") || has("kubernetes") || has("ci/cd") || has("terraform")) {
    roles.add("DevOps & Cloud Engineer");
  }
  if (has("data structures & algorithms") || has("java") || has("c++") || has("python")) {
    roles.add("Software Development Engineer (SDE-1)");
  }

  if (roles.size === 0) {
    roles.add("Software Engineer");
    roles.add("Junior Web Developer");
  }

  return Array.from(roles);
};

/**
 * Main Structured Resume Analyzer
 */
export const analyzeResume = (rawText = "") => {
  const sections = extractSections(rawText);
  const skillsData = extractSkills(rawText);
  const personalInfo = extractPersonalInfo(rawText, sections.header);
  const education = extractEducation(rawText, sections.education);
  const experience = extractExperience(rawText, sections.experience);
  const projects = extractProjects(rawText, sections.projects);
  const certifications = extractCertifications(rawText, sections.certifications);
  const recommendedRoles = recommendRoles(skillsData.allSkills);

  return {
    rawText,
    personalInfo,
    education,
    experience,
    projects,
    certifications,
    skills: skillsData.allSkills,
    skillsByCategory: skillsData.categorizedSkills,
    skillCount: skillsData.skillCount,
    recommendedRoles,
    sectionsDetected: {
      hasHeader: personalInfo.name !== "Candidate",
      hasSummary: sections.summary.length > 0,
      hasExperience: experience.length > 0,
      hasProjects: projects.length > 0,
      hasEducation: education.length > 0,
      hasSkills: skillsData.skillCount > 0,
      hasCertifications: certifications.length > 0,
    },
  };
};

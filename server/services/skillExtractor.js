// Comprehensive Normalized Skill Database and Taxonomy for HireMind

export const SKILL_CATEGORIES = {
  programmingLanguages: "Programming Languages",
  frameworks: "Frameworks & Libraries",
  databases: "Databases",
  cloudAndDevops: "Cloud & DevOps",
  aiAndData: "AI / ML & Data Science",
  tools: "Tools & Platforms",
  coreCs: "Core CS & Methodologies",
  other: "Other Technologies",
};

// Skill Taxonomy with category mapping and aliases
export const SKILL_DICTIONARY = [
  // Programming Languages
  { name: "JavaScript", category: "programmingLanguages", aliases: ["javascript", "js", "java script", "ecmascript", "es6", "es7"] },
  { name: "TypeScript", category: "programmingLanguages", aliases: ["typescript", "ts", "type script"] },
  { name: "Python", category: "programmingLanguages", aliases: ["python", "py", "python3", "python 3", "python2"] },
  { name: "Java", category: "programmingLanguages", aliases: ["java", "core java", "java 8", "java 11", "java 17", "java 21", "j2se"] },
  { name: "C++", category: "programmingLanguages", aliases: ["c++", "cpp", "c plus plus"] },
  { name: "C#", category: "programmingLanguages", aliases: ["c#", "csharp", "c sharp", ".net c#"] },
  { name: "C", category: "programmingLanguages", aliases: ["c lang", "c language", "ansi c"] },
  { name: "Go", category: "programmingLanguages", aliases: ["go", "golang"] },
  { name: "Rust", category: "programmingLanguages", aliases: ["rust", "rustlang"] },
  { name: "PHP", category: "programmingLanguages", aliases: ["php", "php7", "php8"] },
  { name: "Ruby", category: "programmingLanguages", aliases: ["ruby", "ruby on rails", "rails"] },
  { name: "Kotlin", category: "programmingLanguages", aliases: ["kotlin"] },
  { name: "Swift", category: "programmingLanguages", aliases: ["swift", "swiftui"] },
  { name: "Dart", category: "programmingLanguages", aliases: ["dart"] },
  { name: "R", category: "programmingLanguages", aliases: ["r language", "r programming", "r-lang"] },
  { name: "SQL", category: "programmingLanguages", aliases: ["sql", "structured query language", "plsql", "pl/sql", "t-sql"] },
  { name: "Bash", category: "programmingLanguages", aliases: ["bash", "shell scripting", "sh", "zsh", "powershell"] },
  { name: "Scala", category: "programmingLanguages", aliases: ["scala"] },

  // Frameworks & Libraries
  { name: "React", category: "frameworks", aliases: ["react", "reactjs", "react.js", "react js"] },
  { name: "Node.js", category: "frameworks", aliases: ["node", "nodejs", "node.js", "node js"] },
  { name: "Express.js", category: "frameworks", aliases: ["express", "expressjs", "express.js", "express js"] },
  { name: "Next.js", category: "frameworks", aliases: ["nextjs", "next.js", "next js"] },
  { name: "Vue.js", category: "frameworks", aliases: ["vue", "vuejs", "vue.js", "vue 3"] },
  { name: "Angular", category: "frameworks", aliases: ["angular", "angularjs", "angular 2+", "angular 14"] },
  { name: "Django", category: "frameworks", aliases: ["django", "django rest framework", "drf"] },
  { name: "Flask", category: "frameworks", aliases: ["flask"] },
  { name: "FastAPI", category: "frameworks", aliases: ["fastapi", "fast api"] },
  { name: "Spring Boot", category: "frameworks", aliases: ["spring boot", "springboot", "spring framework", "spring"] },
  { name: "ASP.NET", category: "frameworks", aliases: ["asp.net", "asp.net core", ".net core", "dotnet", "dotnet core"] },
  { name: "NestJS", category: "frameworks", aliases: ["nestjs", "nest.js", "nest js"] },
  { name: "Tailwind CSS", category: "frameworks", aliases: ["tailwind", "tailwindcss", "tailwind css"] },
  { name: "Bootstrap", category: "frameworks", aliases: ["bootstrap", "bootstrap 5", "react bootstrap"] },
  { name: "Material UI", category: "frameworks", aliases: ["material ui", "mui", "material-ui"] },
  { name: "Redux", category: "frameworks", aliases: ["redux", "redux toolkit", "rtk", "redux-thunk"] },
  { name: "GraphQL", category: "frameworks", aliases: ["graphql", "apollo client", "apollo graphql"] },
  { name: "Hibernate", category: "frameworks", aliases: ["hibernate", "jpa", "spring data jpa"] },
  { name: "Flutter", category: "frameworks", aliases: ["flutter"] },
  { name: "React Native", category: "frameworks", aliases: ["react native", "react-native"] },
  { name: "Laravel", category: "frameworks", aliases: ["laravel"] },
  { name: "Svelte", category: "frameworks", aliases: ["svelte", "sveltekit"] },
  { name: "Electron", category: "frameworks", aliases: ["electron", "electronjs"] },

  // Databases
  { name: "MongoDB", category: "databases", aliases: ["mongodb", "mongo", "mongo db", "mongoose"] },
  { name: "PostgreSQL", category: "databases", aliases: ["postgresql", "postgres", "psql", "postgres sql"] },
  { name: "MySQL", category: "databases", aliases: ["mysql", "my sql", "mariadb"] },
  { name: "Redis", category: "databases", aliases: ["redis", "redis cache"] },
  { name: "SQLite", category: "databases", aliases: ["sqlite", "sqlite3"] },
  { name: "Oracle Database", category: "databases", aliases: ["oracle", "oracle db", "oracle sql"] },
  { name: "Microsoft SQL Server", category: "databases", aliases: ["sql server", "mssql", "ms sql"] },
  { name: "DynamoDB", category: "databases", aliases: ["dynamodb", "dynamo db", "aws dynamodb"] },
  { name: "Cassandra", category: "databases", aliases: ["cassandra", "apache cassandra"] },
  { name: "Neo4j", category: "databases", aliases: ["neo4j", "graph database"] },
  { name: "Firebase", category: "databases", aliases: ["firebase", "firestore", "firebase realtime database"] },
  { name: "Elasticsearch", category: "databases", aliases: ["elasticsearch", "elastic search", "elk"] },
  { name: "Prisma", category: "databases", aliases: ["prisma", "prisma orm"] },

  // Cloud & DevOps
  { name: "AWS", category: "cloudAndDevops", aliases: ["aws", "amazon web services", "ec2", "s3", "lambda", "aws lambda", "cloudwatch", "route53", "iam"] },
  { name: "Microsoft Azure", category: "cloudAndDevops", aliases: ["azure", "microsoft azure", "azure devops", "azure functions"] },
  { name: "Google Cloud Platform", category: "cloudAndDevops", aliases: ["gcp", "google cloud", "google cloud platform", "bigquery"] },
  { name: "Docker", category: "cloudAndDevops", aliases: ["docker", "containerization", "docker-compose", "dockerfile"] },
  { name: "Kubernetes", category: "cloudAndDevops", aliases: ["kubernetes", "k8s", "kubectl", "helm"] },
  { name: "CI/CD", category: "cloudAndDevops", aliases: ["ci/cd", "ci cd", "continuous integration", "continuous deployment", "github actions", "gitlab ci", "jenkins"] },
  { name: "Terraform", category: "cloudAndDevops", aliases: ["terraform", "iac", "infrastructure as code"] },
  { name: "Linux", category: "cloudAndDevops", aliases: ["linux", "ubuntu", "debian", "centos", "redhat", "unix"] },
  { name: "Nginx", category: "cloudAndDevops", aliases: ["nginx", "reverse proxy"] },
  { name: "Ansible", category: "cloudAndDevops", aliases: ["ansible"] },
  { name: "Prometheus", category: "cloudAndDevops", aliases: ["prometheus", "grafana"] },

  // AI / ML & Data Science
  { name: "Machine Learning", category: "aiAndData", aliases: ["machine learning", "ml", "supervised learning", "unsupervised learning"] },
  { name: "Deep Learning", category: "aiAndData", aliases: ["deep learning", "dl", "neural networks", "cnn", "rnn", "lstm", "transformers"] },
  { name: "Artificial Intelligence", category: "aiAndData", aliases: ["artificial intelligence", "ai", "genai", "generative ai", "llm", "large language models"] },
  { name: "NLP", category: "aiAndData", aliases: ["nlp", "natural language processing", "text mining", "spacy", "nltk", "hugging face", "bert"] },
  { name: "Computer Vision", category: "aiAndData", aliases: ["computer vision", "cv", "opencv", "image processing", "yolo"] },
  { name: "TensorFlow", category: "aiAndData", aliases: ["tensorflow", "tf", "keras"] },
  { name: "PyTorch", category: "aiAndData", aliases: ["pytorch", "torch"] },
  { name: "Scikit-Learn", category: "aiAndData", aliases: ["scikit-learn", "sklearn", "scikit learn"] },
  { name: "Pandas", category: "aiAndData", aliases: ["pandas"] },
  { name: "NumPy", category: "aiAndData", aliases: ["numpy"] },
  { name: "Data Analysis", category: "aiAndData", aliases: ["data analysis", "data analytics", "data visualization", "matplotlib", "seaborn", "tableau", "power bi"] },
  { name: "Apache Spark", category: "aiAndData", aliases: ["spark", "apache spark", "pyspark", "hadoop"] },

  // Core CS & Methodologies
  { name: "Data Structures & Algorithms", category: "coreCs", aliases: ["data structures", "algorithms", "dsa", "data structures & algorithms", "data structures and algorithms", "leetcode", "problem solving"] },
  { name: "Object-Oriented Programming (OOP)", category: "coreCs", aliases: ["oop", "oops", "object oriented programming", "object-oriented programming"] },
  { name: "Database Management Systems (DBMS)", category: "coreCs", aliases: ["dbms", "rdbms", "database management", "database design", "normalization"] },
  { name: "Operating Systems", category: "coreCs", aliases: ["operating systems", "os concepts", "multithreading", "concurrency", "process management"] },
  { name: "Computer Networks", category: "coreCs", aliases: ["computer networks", "networking", "tcp/ip", "http", "https", "dns", "websockets"] },
  { name: "System Design", category: "coreCs", aliases: ["system design", "low level design", "high level design", "lld", "hld", "scalability", "load balancing", "caching"] },
  { name: "REST API", category: "coreCs", aliases: ["rest api", "restful api", "rest", "restful services", "api development", "api integration"] },
  { name: "Microservices", category: "coreCs", aliases: ["microservices", "microservice architecture", "monolith to microservices"] },
  { name: "Agile / Scrum", category: "coreCs", aliases: ["agile", "scrum", "sprint planning", "kanban", "sdlc"] },

  // Tools & Platforms
  { name: "Git", category: "tools", aliases: ["git", "version control"] },
  { name: "GitHub", category: "tools", aliases: ["github", "gitlab", "bitbucket"] },
  { name: "Postman", category: "tools", aliases: ["postman", "insomnia", "api testing"] },
  { name: "VS Code", category: "tools", aliases: ["vs code", "vscode", "visual studio code"] },
  { name: "Jira", category: "tools", aliases: ["jira", "trello", "confluence"] },
  { name: "Figma", category: "tools", aliases: ["figma", "ui/ux", "ui design", "wireframing"] },
  { name: "Vite", category: "tools", aliases: ["vite", "vitejs", "webpack", "babel"] },
  { name: "Jest", category: "tools", aliases: ["jest", "unit testing", "mocha", "chai", "cypress", "playwright"] },

  // Web Technologies & Other
  { name: "HTML", category: "other", aliases: ["html", "html5", "semantic html"] },
  { name: "CSS", category: "other", aliases: ["css", "css3", "sass", "scss", "flexbox", "css grid"] },
  { name: "JSON", category: "other", aliases: ["json", "xml", "jwt", "oauth", "authentication", "authorization"] },
];

// Helper to escape regex special characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Normalizes a raw string by removing excess whitespace and punctuation
 */
export const normalizeText = (text = "") => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[._\-/,()]/g, " ")
    .replace(/\s+/g, " ");
};

/**
 * Extract canonical skills from text using boundary-safe matching
 */
export const extractSkills = (text = "") => {
  if (!text || typeof text !== "string") {
    return {
      allSkills: [],
      categorizedSkills: {
        programmingLanguages: [],
        frameworks: [],
        databases: [],
        cloudAndDevops: [],
        aiAndData: [],
        tools: [],
        coreCs: [],
        other: [],
      },
      skillCount: 0,
    };
  }

  const rawLower = text.toLowerCase();
  const detectedSkillsMap = new Map();

  for (const item of SKILL_DICTIONARY) {
    let matched = false;

    // Check canonical name and each alias
    const searchTerms = [item.name.toLowerCase(), ...item.aliases.map((a) => a.toLowerCase())];

    for (const term of searchTerms) {
      // Special characters like C++, C#, .NET require special word boundary treatment
      let regex;
      if (term === "c++" || term === "cpp") {
        regex = /(?:^|[\s,;()/[\]|])c\+\+(?:$|[\s,;()/[\]|])/i;
      } else if (term === "c#" || term === "csharp") {
        regex = /(?:^|[\s,;()/[\]|])c#(?:$|[\s,;()/[\]|])/i;
      } else if (term === "c" || term === "r") {
        regex = new RegExp(`(?:^|[\\s,;()/\\[\\]|])${term}(?:$|[\\s,;()/\\[\\]|])`, "i");
      } else if (term === ".net" || term === ".net core") {
        regex = /(?:^|[\s,;()/[\]|])\.net(?:\s*core)?(?:$|[\s,;()/[\]|])/i;
      } else {
        const escaped = escapeRegExp(term);
        regex = new RegExp(`\\b${escaped}\\b`, "i");
      }

      if (regex.test(rawLower)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      detectedSkillsMap.set(item.name, item.category);
    }
  }

  const categorizedSkills = {
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    cloudAndDevops: [],
    aiAndData: [],
    tools: [],
    coreCs: [],
    other: [],
  };

  const allSkills = Array.from(detectedSkillsMap.keys());

  for (const [skillName, category] of detectedSkillsMap.entries()) {
    if (categorizedSkills[category]) {
      categorizedSkills[category].push(skillName);
    } else {
      categorizedSkills.other.push(skillName);
    }
  }

  return {
    allSkills,
    categorizedSkills,
    skillCount: allSkills.length,
  };
};

/**
 * Normalizes an array of arbitrary skill strings to canonical skill names
 */
export const normalizeSkillList = (skills = []) => {
  if (!Array.isArray(skills)) return [];
  const textBlob = skills.join(" ");
  return extractSkills(textBlob).allSkills;
};

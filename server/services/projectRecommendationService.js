// Intelligent Project Recommendation Engine mapped to specific technical skill gaps

export const generateProjectRecommendations = (missingSkills = [], partialSkills = [], targetJobTitle = "Software Developer") => {
  const allGaps = [...new Set([...missingSkills, ...partialSkills])].map((s) => s.toLowerCase().trim());

  const projects = [];

  const has = (skill) => allGaps.some((g) => g.includes(skill.toLowerCase()));

  // 1. Spring Boot / Java / Microservices / Docker Gap
  if (has("spring") || has("java") || has("microservices")) {
    projects.push({
      title: "Enterprise E-Commerce Microservices Engine",
      description:
        "Build a distributed backend architecture featuring separate product catalog, order processing, and payment services using Spring Boot and RESTful design.",
      skillsAddressed: ["Spring Boot", "REST API", has("docker") ? "Docker" : "PostgreSQL", has("redis") ? "Redis" : "Microservices"].filter(Boolean),
      technologies: ["Java", "Spring Boot", "Spring Data JPA", "PostgreSQL", "Docker", "JWT", "Swagger"],
      features: [
        "Layered Controller-Service-Repository architecture with DTO validation",
        "JWT Authentication and Role-based Access Control",
        "Dockerized multi-container setup with PostgreSQL database and pgAdmin",
        "Comprehensive Swagger / OpenAPI 3.0 documentation",
      ],
      impactOnMatch: "+16% Match Score Boost ? Demonstrates production Java/Spring enterprise engineering.",
      resumeBulletExample:
        "Architected scalable Spring Boot microservices with Spring Data JPA and PostgreSQL, containerized via Docker and fully documented with OpenAPI 3.0.",
    });
  }

  // 2. Docker / Cloud / DevOps / AWS / Kubernetes Gap
  if (has("docker") || has("aws") || has("kubernetes") || has("ci/cd") || has("devops") || has("cloud")) {
    projects.push({
      title: "Automated Cloud Deployment & CI/CD Pipeline Stack",
      description:
        "Containerize a multi-tier web application and build automated GitHub Actions workflows to test, build, and deploy container images to AWS cloud.",
      skillsAddressed: ["Docker", has("aws") ? "AWS" : "CI/CD", has("kubernetes") ? "Kubernetes" : "Linux", "Git"].filter(Boolean),
      technologies: ["Docker", "Docker Compose", "AWS (EC2, S3)", "GitHub Actions", "Nginx", "Linux"],
      features: [
        "Multi-stage Docker build minimizing production image size by 60%",
        "Automated CI/CD pipeline running unit tests on every Git pull request",
        "Reverse proxy and SSL certificate termination configured with Nginx",
        "Automated container deployment to AWS cloud virtual instance",
      ],
      impactOnMatch: "+14% Match Score Boost ? Proves cloud infrastructure and DevOps automation competence.",
      resumeBulletExample:
        "Configured multi-stage Docker build pipelines and automated GitHub Actions CI/CD workflows, reducing deployment cycle time by 40% on AWS EC2.",
    });
  }

  // 3. React / Next.js / TypeScript / Frontend UI Gap
  if (has("react") || has("next.js") || has("typescript") || has("frontend") || has("redux")) {
    projects.push({
      title: "Real-Time Collaborative Dashboard & Task Manager",
      description:
        "Develop a modern, highly responsive web dashboard with drag-and-drop kanban boards, live WebSocket updates, and strict TypeScript types.",
      skillsAddressed: ["TypeScript", "React", has("next.js") ? "Next.js" : "Tailwind CSS", "REST API"].filter(Boolean),
      technologies: ["React", "TypeScript", "Tailwind CSS", "WebSockets", "Vite", "Zustand/Redux"],
      features: [
        "Strict TypeScript typing across all components, API schemas, and state stores",
        "Live bi-directional synchronization across multiple browser sessions with WebSockets",
        "Accessible drag-and-drop task reordering with optimistic UI updates",
        "Dark/Light adaptive theme system with responsive mobile layouts",
      ],
      impactOnMatch: "+15% Match Score Boost ? Highlights modern frontend engineering and TypeScript proficiency.",
      resumeBulletExample:
        "Engineered real-time collaboration dashboard in React and TypeScript with WebSockets, delivering sub-50ms synchronized UI state updates.",
    });
  }

  // 4. AI / Machine Learning / Data Science / Python / NLP Gap
  if (has("machine learning") || has("python") || has("deep learning") || has("ai") || has("nlp") || has("fastapi") || has("pandas")) {
    projects.push({
      title: "Intelligent Semantic Search & NLP Document Classifier",
      description:
        "Build a high-performance machine learning inference API that generates text embeddings and performs vector similarity search on uploaded documents.",
      skillsAddressed: ["Python", "Machine Learning", has("nlp") ? "NLP" : "FastAPI", has("pandas") ? "Pandas" : "Docker"].filter(Boolean),
      technologies: ["Python", "FastAPI", "Scikit-learn", "PyTorch / Transformers", "Pandas", "Docker"],
      features: [
        "NLP text preprocessing and vector embedding generation pipeline",
        "High-throughput asynchronous REST API built with FastAPI",
        "Vector cosine similarity matching delivering sub-second document ranking",
        "Containerized inference service packaged with Docker",
      ],
      impactOnMatch: "+18% Match Score Boost ? Validates modern applied AI and ML engineering capability.",
      resumeBulletExample:
        "Developed asynchronous FastAPI inference service utilizing PyTorch NLP models, achieving 92% classification accuracy across 50,000+ test documents.",
    });
  }

  // 5. DSA / Problem Solving / Low-Level System Design Gap
  if (has("data structures") || has("algorithm") || has("dsa") || has("system design") || projects.length === 0) {
    projects.push({
      title: "High-Throughput In-Memory Key-Value Cache Engine",
      description:
        "Build a custom in-memory caching server implementing LRU eviction, concurrency controls, and TTL expiration inspired by Redis.",
      skillsAddressed: ["Data Structures & Algorithms", "System Design", "Concurrency", "REST API"],
      technologies: ["Java / C++ / Go", "Data Structures (Doubly Linked List + Hash Map)", "Multithreading", "TCP/HTTP Sockets"],
      features: [
        "O(1) average time complexity for GET, SET, and DELETE operations",
        "Thread-safe concurrent data access with fine-grained mutex locking",
        "Automated LRU (Least Recently Used) cache eviction policy under memory limits",
        "Custom persistence mechanism writing snapshots to disk",
      ],
      impactOnMatch: "+15% Match Score Boost ? Strong proof of core CS fundamentals and low-level engineering.",
      resumeBulletExample:
        "Engineered thread-safe in-memory cache supporting O(1) LRU eviction and atomic operations, handling 15,000 concurrent requests/sec.",
    });
  }

  return projects.slice(0, 3);
};

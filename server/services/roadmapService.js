// Deep Curated Skill Curriculums for Day-by-Day Placement Roadmaps
const SKILL_MODULES = {
  "spring boot": [
    {
      title: "Spring Boot Fundamentals & Project Architecture",
      topics: ["Spring Core & IoC Container", "Dependency Injection & Annotations (@Component, @Service, @Autowired)", "Spring Initializr"],
      tasks: ["Bootstrap Maven/Gradle project", "Create first @RestController with GET endpoint"],
      checkpoint: "Local Spring Boot server running and responding with JSON payload at /api/health",
    },
    {
      title: "Dependency Injection & Layered MVC Architecture",
      topics: ["Controller-Service-Repository Pattern", "Request Mappings (@GetMapping, @PostMapping)", "Request DTOs & Validation"],
      tasks: ["Implement CRUD controller for an entity (e.g. Student / Candidate)", "Add @Valid annotations with error handling"],
      checkpoint: "Structured HTTP request validation rejecting malformed payloads",
    },
    {
      title: "REST APIs & Exception Handling",
      topics: ["RESTful Standards & HTTP Status Codes", "Global Exception Handler (@ControllerAdvice, @ExceptionHandler)", "ResponseEntity"],
      tasks: ["Build clean error response model", "Implement customized resource-not-found exceptions"],
      checkpoint: "Uniform error responses with HTTP 400, 404, and 500 status codes",
    },
    {
      title: "Spring Data JPA & Hibernate ORM",
      topics: ["Entity Mapping (@Entity, @Table, @Id)", "JpaRepository & Query Methods", "Database Relations (@OneToMany, @ManyToOne)"],
      tasks: ["Configure PostgreSQL/MySQL datasource in application.properties", "Implement repository interfaces"],
      checkpoint: "CRUD operations persisted into database without raw SQL queries",
    },
    {
      title: "Database Integration & Transactions",
      topics: ["Spring @Transactional Behavior", "Pagination & Sorting with Pageable", "Database Migrations (Flyway/Liquibase)"],
      tasks: ["Add pageable endpoints for large datasets", "Test atomic transaction rollbacks"],
      checkpoint: "Paginated endpoints returning items in sorted order",
    },
    {
      title: "Spring Security & JWT Authentication",
      topics: ["Spring Security Filter Chain", "JWT Token Creation & Verification", "Role-based Access Control (@PreAuthorize)"],
      tasks: ["Implement /auth/register and /auth/login endpoints", "Protect private resources with Bearer token filter"],
      checkpoint: "Secure endpoints rejecting unauthenticated requests with 401 Unauthorized",
    },
    {
      title: "Capstone Spring Boot REST API & Unit Testing",
      topics: ["JUnit 5 & Mockito Unit Tests", "Swagger / OpenAPI Documentation", "Production Profile Configuration"],
      tasks: ["Write MockMvc controller tests", "Generate interactive Swagger UI documentation at /swagger-ui.html"],
      checkpoint: "Fully documented and tested production-ready REST API",
    },
  ],

  docker: [
    {
      title: "Containerization Fundamentals & Dockerfile Mastery",
      topics: ["Containers vs VMs", "Docker Engine Architecture", "Writing Multi-stage Dockerfiles"],
      tasks: ["Write optimized Dockerfile for a Node/Spring/Python service", "Build local Docker image"],
      checkpoint: "Docker image built with minimal layer size",
    },
    {
      title: "Container Lifecycle & Port Mapping",
      topics: ["Docker CLI commands (run, ps, logs, exec, stop)", "Port Binding (-p)", "Environment variables (-e)"],
      tasks: ["Run containerized backend with exposed port", "Inspect running container logs"],
      checkpoint: "Access web API running inside container via host browser",
    },
    {
      title: "Volumes, Data Persistence & Networks",
      topics: ["Docker Bind Mounts vs Named Volumes", "Bridge Networks", "Inter-container communication"],
      tasks: ["Persist database container data across restarts using named volumes", "Create custom bridge network"],
      checkpoint: "Database container retains all records after stop and restart",
    },
    {
      title: "Multi-Container Orchestration with Docker Compose",
      topics: ["docker-compose.yml Syntax", "Services, Networks, and Volumes in Compose", "depends_on & Healthchecks"],
      tasks: ["Write compose file running Frontend + Backend + Database together", "Launch stack with single docker-compose up"],
      checkpoint: "Entire application stack boots up automatically with one command",
    },
  ],

  "data structures & algorithms": [
    {
      title: "Time & Space Complexity + Arrays & Two Pointers",
      topics: ["Big-O Analysis", "Two Pointer Technique", "Sliding Window Pattern"],
      tasks: ["Solve 4 LeetCode medium problems on Two Pointers & Sliding Window"],
      checkpoint: "Optimal O(N) solutions written with zero extra space overhead",
    },
    {
      title: "Hash Maps, Sets & String Algorithms",
      topics: ["Hash Collision Handling", "Frequency Counting Patterns", "Prefix Sums"],
      tasks: ["Implement Subarray Sum Equals K and Longest Substring Without Repeating Characters"],
      checkpoint: "O(N) time complexity verified on hash map challenges",
    },
    {
      title: "Linked Lists, Stacks & Queues",
      topics: ["Fast & Slow Pointers (Floyd Cycle Detection)", "Monotonic Stack Pattern", "Next Greater Element"],
      tasks: ["Reverse Linked List in-place and solve Daily Temperatures with Monotonic Stack"],
      checkpoint: "Pass all edge cases on empty/single-node linked list traversals",
    },
    {
      title: "Binary Trees & BST Traversals",
      topics: ["DFS (Pre/In/Postorder)", "BFS Level Order Traversal", "Binary Search Tree properties"],
      tasks: ["Implement Lowest Common Ancestor and Validate BST"],
      checkpoint: "Recursive and iterative tree traversal implementations",
    },
    {
      title: "Graphs: BFS, DFS & Topological Sort",
      topics: ["Adjacency List Representation", "Connected Components", "Cycle Detection in Directed Graphs"],
      tasks: ["Solve Number of Islands and Course Schedule (Kahn's Algorithm)"],
      checkpoint: "Detect graph cycles and print valid topological ordering",
    },
    {
      title: "Dynamic Programming Foundations",
      topics: ["Memoization (Top-down) vs Tabulation (Bottom-up)", "1D DP (House Robber, Coin Change)"],
      tasks: ["Solve Coin Change and Longest Increasing Subsequence (LIS)"],
      checkpoint: "Identify optimal substructure and write transition formulas",
    },
  ],

  aws: [
    {
      title: "AWS Core Infrastructure: IAM, VPC & EC2",
      topics: ["IAM Roles & Least Privilege Policies", "Security Groups & Key Pairs", "Launching EC2 Linux Instances"],
      tasks: ["Launch and SSH into EC2 instance", "Configure inbound firewall security group rules"],
      checkpoint: "SSH terminal access to cloud Linux virtual machine",
    },
    {
      title: "Storage & Serverless: S3 & AWS Lambda",
      topics: ["S3 Buckets, ACLs & Pre-signed URLs", "AWS Lambda Serverless Functions", "Event-driven architecture"],
      tasks: ["Create S3 bucket for resume/media uploads", "Deploy basic Lambda function triggered by API Gateway"],
      checkpoint: "Direct file upload to S3 using pre-signed cloud URL",
    },
    {
      title: "Production Deployment with ECS, RDS & Route53",
      topics: ["RDS Managed PostgreSQL/MySQL", "Docker on AWS ECS Fargate", "CloudWatch Monitoring"],
      tasks: ["Connect application to RDS database instance", "Deploy Docker image to AWS ECS"],
      checkpoint: "Production container running live on AWS with managed database",
    },
  ],

  typescript: [
    {
      title: "TypeScript Core Types, Interfaces & Generics",
      topics: ["Type Annotations & Inferences", "Interfaces vs Type Aliases", "Generics (<T>) and Union Types"],
      tasks: ["Convert 3 JavaScript utility files into strictly-typed TypeScript", "Create generic API response type wrapper"],
      checkpoint: "TypeScript compiler (tsc) passes with zero errors under strict mode",
    },
    {
      title: "TypeScript with React & Node.js REST APIs",
      topics: ["Typing React Props & State", "Generic Event Handlers", "Typing Express Request & Response Handlers"],
      tasks: ["Build React components with strict props interface", "Create typed async Express endpoints"],
      checkpoint: "Full end-to-end type safety from React frontend to Express backend",
    },
  ],

  kubernetes: [
    {
      title: "Kubernetes Architecture, Pods & Deployments",
      topics: ["Control Plane vs Worker Nodes", "Pod Specifications", "Deployment Manifests & ReplicaSets"],
      tasks: ["Write deployment.yaml for backend application", "Scale pods up and down with kubectl scale"],
      checkpoint: "Multiple pod replicas running with auto-healing",
    },
    {
      title: "Services, Ingress & ConfigMaps",
      topics: ["ClusterIP, NodePort & LoadBalancer Services", "Ingress Controllers", "ConfigMaps & Secrets"],
      tasks: ["Expose backend pods via Service", "Inject environment secrets into pods via ConfigMap"],
      checkpoint: "External web traffic successfully routed to internal cluster pods",
    },
  ],

  graphql: [
    {
      title: "GraphQL Schema Definition & Resolvers",
      topics: ["Schema Definition Language (SDL)", "Queries, Mutations, and Types", "Apollo Server / Express GraphQL"],
      tasks: ["Define User & Job schema with relationships", "Implement Query and Mutation resolvers"],
      checkpoint: "Execute custom GraphQL queries in Apollo GraphQL Sandbox",
    },
  ],

  redis: [
    {
      title: "Redis In-Memory Caching & Session Store",
      topics: ["Key-Value Strings, Lists, Sets, Hashes", "Cache-Aside Pattern & TTL Expiration", "Pub/Sub Messaging"],
      tasks: ["Implement Redis cache layer on heavy database queries", "Set automatic 15-minute TTL cache expiration"],
      checkpoint: "API response latency reduced from 120ms to under 5ms on cached hits",
    },
  ],

  "system design": [
    {
      title: "Scalability, Load Balancing & Horizontal Scaling",
      topics: ["Vertical vs Horizontal Scaling", "Load Balancing Algorithms (Round Robin, Least Connections)", "Stateless Architecture"],
      tasks: ["Design architecture diagram for web service handling 100k requests/sec"],
      checkpoint: "Identify single points of failure (SPOF) and eliminate bottlenecks",
    },
    {
      title: "Database Sharding, Caching & Microservices",
      topics: ["Database Replication & Sharding", "CAP Theorem", "Message Queues (Kafka/RabbitMQ) for Asynchronous Processing"],
      tasks: ["Design end-to-end notification system or URL shortener architecture"],
      checkpoint: "Complete High-Level Architecture (HLD) with data flow diagram",
    },
  ],
};

/**
 * Generate a personalized day-by-day learning roadmap tailored to candidate's missing & partial skills
 */
export const generatePersonalizedRoadmap = (missingSkills = [], partialSkills = [], targetJobTitle = "Target Role") => {
  const skillsToPrepare = [...new Set([...missingSkills, ...partialSkills])];

  if (skillsToPrepare.length === 0) {
    return {
      totalDays: 3,
      targetJobTitle,
      skillsCovered: ["Interview Mastery", "System Design"],
      summary: "Your skills already strongly match this job description! Use this accelerated 3-day roadmap for interview polish.",
      milestones: [
        {
          day: 1,
          skillFocus: "System Design & Architecture",
          title: "System Architecture & High-Level Design (HLD)",
          topics: ["Scalability", "Microservices Design", "Database Indexing & Caching"],
          tasks: ["Review high-level architectural trade-offs for target role"],
          checkpoint: "Able to articulate design choices and trade-offs in technical interviews",
        },
        {
          day: 2,
          skillFocus: "DSA & Problem Solving",
          title: "Core Data Structures & Algorithms Practice",
          topics: ["Graph Traversals", "Dynamic Programming", "Two Pointers"],
          tasks: ["Solve 3 company-specific technical interview questions"],
          checkpoint: "Write clean, bug-free code under 30-minute time limit",
        },
        {
          day: 3,
          skillFocus: "Behavioral & Tech Deep-dive",
          title: "Resume Project Walkthroughs & Behavioral Preparation",
          topics: ["STAR Method", "Explainable Architecture Decisions", "Handling Edge Cases"],
          tasks: ["Prepare 3-minute technical elevator pitch for each resume project"],
          checkpoint: "Ready to confidently walk interviewers through project codebase",
        },
      ],
    };
  }

  const milestones = [];
  const coveredSkills = [];
  let currentDay = 1;

  for (const skill of skillsToPrepare) {
    const sLower = skill.toLowerCase().trim();
    const modules = SKILL_MODULES[sLower];

    if (modules && modules.length > 0) {
      coveredSkills.push(skill);
      // Limit to max 3 days per skill to keep roadmap actionable (7 to 10 days total)
      const selectedModules = modules.slice(0, 3);

      for (const mod of selectedModules) {
        milestones.push({
          day: currentDay++,
          skillFocus: skill,
          title: mod.title,
          topics: mod.topics,
          tasks: mod.tasks,
          checkpoint: mod.checkpoint,
        });
      }
    } else {
      // Generic structured milestone for other skills
      coveredSkills.push(skill);
      milestones.push({
        day: currentDay++,
        skillFocus: skill,
        title: `${skill} Fundamentals & Practical Integration`,
        topics: [`${skill} Architecture & Core API Concepts`, "Industry Best Practices", "Integration with Existing Stack"],
        tasks: [`Review official documentation for ${skill}`, `Build a mini working module utilizing ${skill}`],
        checkpoint: `Functional code artifact demonstrating hands-on proficiency in ${skill}`,
      });
    }

    if (currentDay > 10) break; // Keep roadmap within a 7-10 day high-yield timeframe
  }

  const summary = `Personalized ${milestones.length}-Day Action Plan to close gaps in ${coveredSkills.slice(0, 3).join(", ")}${
    coveredSkills.length > 3 ? ` and ${coveredSkills.length - 3} other skills` : ""
  } before your placement interview.`;

  return {
    totalDays: milestones.length,
    targetJobTitle,
    skillsCovered: coveredSkills,
    summary,
    milestones,
  };
};

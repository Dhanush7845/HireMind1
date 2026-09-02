import React, { useState, useEffect } from "react";
import { jobAPI, resumeAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import JobMatchCard from "../components/JobMatchCard";
import SkillGap from "../components/SkillGap";
import LoadingSpinner from "../components/LoadingSpinner";
import ResumeUpload from "../components/ResumeUpload";
import {
  Briefcase,
  Sparkles,
  Send,
  FileText,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

// Sample Job Descriptions for instantaneous recruiter demos
const SAMPLE_JOBS = [
  {
    label: "Full Stack Engineer (MERN + Cloud)",
    title: "Full Stack Software Engineer",
    company: "Fintech Corp",
    description: `We are looking for an exceptional Full Stack Software Engineer to build highly reliable, scalable customer web applications.
Required Technical Skills:
- 2+ years experience building web applications with React, Node.js, TypeScript, and Express.js.
- Strong hands-on database experience with MongoDB, PostgreSQL, and Redis caching.
- Solid background in Docker containerization, AWS cloud architecture, and CI/CD pipelines.
- Solid grounding in Data Structures & Algorithms, Object-Oriented Programming, and REST API design.
Preferred Qualifications:
- Experience with Next.js, GraphQL, and Python.
- Knowledge of Microservices architecture and unit testing with Jest.`,
  },
  {
    label: "AI / Machine Learning Engineer",
    title: "AI / ML Solutions Engineer",
    company: "AI Labs",
    description: `Join our AI Solutions team developing next-generation intelligent applications and LLM agent pipelines.
Required Qualifications:
- Proficiency in Python, PyTorch, TensorFlow, Scikit-learn, and Pandas.
- Strong foundation in Deep Learning, NLP (Natural Language Processing), and Computer Vision.
- Experience developing REST API endpoints with FastAPI or Flask and containerizing with Docker.
- Strong knowledge of Data Structures, Algorithms, and System Design.
Preferred:
- Experience with AWS, Kubernetes, and Data Analysis with NumPy.`,
  },
  {
    label: "Frontend Engineer (React + UI)",
    title: "Senior Frontend Engineer",
    company: "Design Systems",
    description: `We are seeking a Frontend Engineer passionate about crafting pixel-perfect, accessible user interfaces.
Requirements:
- Deep expertise in JavaScript, TypeScript, React, HTML5, CSS3, and Tailwind CSS.
- Experience with state management using Redux or React Context, and bundlers like Vite.
- Solid understanding of REST APIs, Git, GitHub, and Figma design handoff.
Preferred Skills:
- Unit testing with Jest or Cypress.
- Next.js and responsive mobile web design.`,
  },
  {
    label: "Backend & DevOps Engineer",
    title: "Backend Cloud Infrastructure Engineer",
    company: "Cloud Infrastructure Inc",
    description: `Seeking a Backend Engineer to scale our distributed cloud systems and microservices.
Required Skills:
- Expertise in Java, Go, or Node.js with Spring Boot or Express.js.
- Deep knowledge of PostgreSQL, MySQL, Redis, and Database Management Systems (DBMS).
- Hands-on experience with AWS, Docker, Kubernetes, Linux, and CI/CD automation.
- Solid expertise in System Design, Microservices, and Operating Systems.
Preferred:
- Terraform, Python, and Prometheus monitoring.`,
  },
];

const JobMatch = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await resumeAPI.getResumes();
        if (res?.data && res.data.length > 0) {
          setResumes(res.data);
          setSelectedResumeId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Fetch resumes error:", err);
      }
    };

    fetchResumes();
  }, []);

  const handleQuickFill = (sample) => {
    setJobTitle(sample.title);
    setCompany(sample.company);
    setJobDescription(sample.description);
  };

  const handleAnalyzeJob = async (e) => {
    e.preventDefault();
    if (!jobDescription || jobDescription.trim().length < 20) {
      setError("Please paste a comprehensive job description (at least 20 characters).");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const res = await jobAPI.analyzeJob({
        jobTitle: jobTitle || "Custom Job Opportunity",
        company: company || "Hiring Organization",
        jobDescription,
        resumeId: selectedResumeId || undefined,
      });

      if (res?.data) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to analyze job description.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar onOpenUpload={() => setShowUploadModal(true)} />

        <main className="page-body">
          <div style={{ marginBottom: "1.75rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>
              Job Description Matcher & Gap Intelligence
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
              Paste a target job posting to compare against your resume skills and generate tailored placement strategy.
            </p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <div className="job-match-layout">
            {/* Left Column: Input Form */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Briefcase size={18} style={{ color: "var(--primary)" }} />
                  <span>Job Opportunity Details</span>
                </h3>
              </div>

              <form onSubmit={handleAnalyzeJob}>
                {resumes.length > 0 ? (
                  <div className="form-group">
                    <label className="form-label">Compare Against Resume</label>
                    <select
                      className="form-input"
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                    >
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.originalName} ({new Date(r.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="alert-error" style={{ marginBottom: "1rem" }}>
                    No resume uploaded yet. Matching against your profile skills.{" "}
                    <button
                      type="button"
                      style={{ color: "var(--primary)", background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}
                      onClick={() => setShowUploadModal(true)}
                    >
                      Upload Resume Now →
                    </button>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Target Role / Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Full Stack Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Google / Microsoft"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description (Requirements & Qualifications)</label>
                  <textarea
                    className="textarea-field"
                    placeholder="Paste full job description, required skills, responsibilities, and preferred qualifications here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Quick Fill Chips */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    ⚡ Instant Placement Demo Templates
                  </div>
                  <div className="quick-fill-chips">
                    {SAMPLE_JOBS.map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        className="chip-btn"
                        onClick={() => handleQuickFill(sample)}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  disabled={analyzing}
                >
                  {analyzing ? "Analyzing Compatibility & Skill Gaps..." : "Analyze Match & Gaps →"}
                </button>
              </form>
            </div>

            {/* Right Column: Comparison Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {analyzing ? (
                <div className="card">
                  <LoadingSpinner message="Extracting job requirements, comparing candidate skills, and computing compatibility score..." />
                </div>
              ) : result ? (
                <>
                  <JobMatchCard matchData={result} />
                  <SkillGap
                    matchedSkills={result.matchedSkills || []}
                    missingSkills={result.missingSkills || []}
                  />

                  {/* Keyword Matches Breakdown */}
                  {result.keywordMatches && result.keywordMatches.length > 0 && (
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">
                          <TrendingUp size={18} style={{ color: "var(--accent-cyan)" }} />
                          <span>Keyword Density Analysis</span>
                        </h3>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {result.keywordMatches.map((kw, i) => (
                          <span
                            key={i}
                            className={`skill-tag ${kw.presentInResume ? "skill-tag-matched" : "skill-tag-missing"}`}
                          >
                            {kw.presentInResume ? "✓" : "!"} {kw.keyword} ({kw.frequencyInJob}x in JD)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                  <Briefcase size={44} style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Ready for Comparison</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "400px", margin: "0.5rem auto 1.5rem" }}>
                    Select or paste a job posting on the left to measure compatibility, identify missing skills, and calculate matching probability.
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleQuickFill(SAMPLE_JOBS[0])}
                    >
                      Try MERN Job Template
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleQuickFill(SAMPLE_JOBS[1])}
                    >
                      Try AI/ML Job Template
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 100,
          }}
        >
          <ResumeUpload
            onUploadSuccess={(data) => {
              setShowUploadModal(false);
              if (data?.resume?.id) {
                setResumes((prev) => [data.resume, ...prev]);
                setSelectedResumeId(data.resume.id);
              }
            }}
            onClose={() => setShowUploadModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default JobMatch;

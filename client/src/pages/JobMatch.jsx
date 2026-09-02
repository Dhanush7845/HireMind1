import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobAPI, resumeAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PlacementReadinessCard from "../components/PlacementReadinessCard";
import SkillGapMatrix from "../components/SkillGapMatrix";
import LearningRoadmap from "../components/LearningRoadmap";
import ProjectRecommendations from "../components/ProjectRecommendations";
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
  Calendar,
  FolderGit2,
  RefreshCw,
  Award,
} from "lucide-react";

// Instant placement demo job templates
const SAMPLE_JOBS = [
  {
    label: "Software Engineer (Java / Spring / DSA)",
    title: "Software Engineer",
    company: "Enterprise Software Corp",
    description: `We are looking for a Software Engineer to join our core backend applications team.
Requirements:
- Strong programming foundation in Java and Object-Oriented Programming (OOP).
- Hands-on experience developing REST APIs with Spring Boot and Spring Data JPA.
- Solid knowledge of SQL, Database Management Systems (DBMS), and PostgreSQL.
- Strong grasp of Data Structures & Algorithms (DSA) and problem-solving skills.
- Experience with Git version control and Docker containerization.
Preferred:
- Experience with Redis caching and Microservices architecture.
- Understanding of CI/CD pipelines.`,
  },
  {
    label: "Full Stack Developer (MERN + Cloud)",
    title: "Full Stack Engineer",
    company: "Fintech Cloud Systems",
    description: `Seeking a Full Stack Engineer to build high-scale web platforms.
Requirements:
- 2+ years experience building web applications with React, Node.js, TypeScript, and Express.js.
- Strong database experience with MongoDB, PostgreSQL, and Redis caching.
- Solid understanding of Docker, AWS cloud architecture, and CI/CD automation.
- Data Structures & Algorithms, REST APIs, and System Design.
Preferred Qualifications:
- Next.js, GraphQL, and Unit Testing with Jest.`,
  },
  {
    label: "AI / Machine Learning Engineer",
    title: "AI & ML Solutions Engineer",
    company: "Cognitive AI Labs",
    description: `Join our team developing state-of-the-art AI inference pipelines and LLM applications.
Requirements:
- Proficiency in Python, PyTorch, TensorFlow, Scikit-learn, and Pandas.
- Solid foundation in Deep Learning, NLP (Natural Language Processing), and Computer Vision.
- Developing high-throughput REST APIs with FastAPI or Flask, containerized via Docker.
- Data Structures, Algorithms, and System Design.
Preferred:
- AWS, Kubernetes, and NumPy data analytics.`,
  },
  {
    label: "Frontend React Engineer",
    title: "Senior Frontend Engineer",
    company: "Modern Web UI Studio",
    description: `Looking for a Frontend Engineer passionate about crafting accessible, high-performance user interfaces.
Requirements:
- Expertise in JavaScript, TypeScript, React, HTML5, CSS3, and Tailwind CSS.
- State management with Redux Toolkit or React Context, and modern bundlers like Vite.
- Solid understanding of REST APIs, Git, and Figma design handoff.
Preferred:
- Next.js, WebSockets, and unit testing with Jest.`,
  },
];

const JobMatch = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState("readiness");

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
        jobTitle: jobTitle || "Software Engineer",
        company: company || "Hiring Company",
        jobDescription,
        resumeId: selectedResumeId || undefined,
      });

      if (res?.data) {
        setResult(res.data);
        setActiveResultTab("readiness");
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
              Target Job Match & Placement Readiness Hub
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
              Evaluate your resume against real job requirements, detect skill gaps, and generate your personalized learning roadmap.
            </p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <div className="job-match-layout">
            {/* Left Column: Input Form */}
            <div className="card" style={{ height: "fit-content" }}>
              <div className="card-header">
                <h3 className="card-title">
                  <Briefcase size={18} style={{ color: "var(--primary)" }} />
                  <span>Job Opportunity Details</span>
                </h3>
              </div>

              <form onSubmit={handleAnalyzeJob}>
                {resumes.length > 0 ? (
                  <div className="form-group">
                    <label className="form-label">Compare Against Candidate Resume</label>
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
                      Upload Resume Now ?
                    </button>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Target Role / Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Google / Amazon"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description (Requirements & Qualifications)</label>
                  <textarea
                    className="textarea-field"
                    placeholder="Paste job description requirements, responsibilities, and qualifications here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Quick Fill Demo Chips */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    ? Instant Placement Demo Templates
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
                  {analyzing ? "Computing Placement Intelligence..." : "Analyze Match & Generate Roadmap ?"}
                </button>
              </form>
            </div>

            {/* Right Column: Comparison Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {analyzing ? (
                <div className="card">
                  <LoadingSpinner message="Extracting job requirements, detecting skill gaps, calculating placement readiness, and generating roadmap..." />
                </div>
              ) : result ? (
                <>
                  {/* Top Match Bar */}
                  <div className="card" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                          Target Opportunity Match
                        </div>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>
                          {result.jobTitle} {result.company ? `? ${result.company}` : ""}
                        </h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                          Experience: {result.experienceRequired || "Entry Level"} ? Education: {result.educationRequired || "B.Tech/CS"}
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                          {result.matchScore}%
                        </div>
                        <span className="score-grade-badge badge-excellent" style={{ marginTop: "4px" }}>
                          Job Match Score
                        </span>
                      </div>
                    </div>

                    {/* Skill Breakdown Summary Pill Group */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
                      <div style={{ padding: "0.5rem 0.75rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                        <div style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 700, textTransform: "uppercase" }}>Strong Matches</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{result.strongMatches?.length || 0} Skills</div>
                      </div>

                      <div style={{ padding: "0.5rem 0.75rem", background: "rgba(245, 158, 11, 0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                        <div style={{ fontSize: "0.7rem", color: "#fbbf24", fontWeight: 700, textTransform: "uppercase" }}>Partial Matches</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{result.partialMatches?.length || 0} Skills</div>
                      </div>

                      <div style={{ padding: "0.5rem 0.75rem", background: "rgba(244, 63, 94, 0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
                        <div style={{ fontSize: "0.7rem", color: "#f87171", fontWeight: 700, textTransform: "uppercase" }}>Missing Skills</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{result.missingMatches?.length || 0} Skills</div>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation for Detailed Sections */}
                  <div className="quick-fill-chips" style={{ marginBottom: "0.5rem" }}>
                    <button
                      className={`chip-btn ${activeResultTab === "readiness" ? "active" : ""}`}
                      style={activeResultTab === "readiness" ? { background: "var(--primary)", color: "#fff" } : {}}
                      onClick={() => setActiveResultTab("readiness")}
                    >
                      ?? Placement Readiness
                    </button>
                    <button
                      className={`chip-btn ${activeResultTab === "gaps" ? "active" : ""}`}
                      style={activeResultTab === "gaps" ? { background: "var(--primary)", color: "#fff" } : {}}
                      onClick={() => setActiveResultTab("gaps")}
                    >
                      ?? Skill Gap Matrix ({result.skillGaps?.length || 0})
                    </button>
                    <button
                      className={`chip-btn ${activeResultTab === "roadmap" ? "active" : ""}`}
                      style={activeResultTab === "roadmap" ? { background: "var(--primary)", color: "#fff" } : {}}
                      onClick={() => setActiveResultTab("roadmap")}
                    >
                      ?? {result.roadmap?.totalDays || 7}-Day Roadmap
                    </button>
                    <button
                      className={`chip-btn ${activeResultTab === "projects" ? "active" : ""}`}
                      style={activeResultTab === "projects" ? { background: "var(--primary)", color: "#fff" } : {}}
                      onClick={() => setActiveResultTab("projects")}
                    >
                      ?? Project Recommendations ({result.projectRecommendations?.length || 0})
                    </button>
                  </div>

                  {/* Active Section Content */}
                  {activeResultTab === "readiness" && (
                    <PlacementReadinessCard readiness={result.placementReadiness} />
                  )}

                  {activeResultTab === "gaps" && (
                    <SkillGapMatrix
                      skillGaps={result.skillGaps || []}
                      strongCount={result.strongMatches?.length || 0}
                      partialCount={result.partialMatches?.length || 0}
                      missingCount={result.missingMatches?.length || 0}
                    />
                  )}

                  {activeResultTab === "roadmap" && (
                    <LearningRoadmap roadmap={result.roadmap} />
                  )}

                  {activeResultTab === "projects" && (
                    <ProjectRecommendations projects={result.projectRecommendations || []} />
                  )}

                  {/* Resume Improvement Loop Banner */}
                  <div className="card" style={{ background: "rgba(17, 24, 39, 0.7)", border: "1px dashed var(--border-focus)", textAlign: "center", padding: "1.5rem" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
                      ?? Resume Improvement & Re-analysis Loop
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "550px", margin: "0 auto 1rem" }}>
                      Follow your personalized roadmap, build one of the recommended project artifacts, update your resume, and re-upload to watch your Placement Readiness climb!
                    </p>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowUploadModal(true)}>
                      <RefreshCw size={14} />
                      <span>Upload Updated Resume</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                  <Briefcase size={48} style={{ color: "var(--primary)", margin: "0 auto 1rem" }} />
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>Ready for Placement Job Analysis</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "420px", margin: "0.5rem auto 1.5rem" }}>
                    Select a resume and paste a job description on the left to evaluate your match, detect skill gaps, and generate your personalized step-by-step roadmap.
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleQuickFill(SAMPLE_JOBS[0])}
                    >
                      Try Software Engineer (Java/Spring)
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleQuickFill(SAMPLE_JOBS[1])}
                    >
                      Try Full Stack (MERN)
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

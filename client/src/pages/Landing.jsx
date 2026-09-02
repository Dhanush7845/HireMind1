import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  FileCheck2,
  Briefcase,
  TrendingUp,
  Cpu,
  Target,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Upload,
  Calendar,
  FolderGit2,
} from "lucide-react";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-primary)" }}>
      {/* Top Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2.5rem",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface-glass)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="sidebar-brand-icon">
            <Sparkles size={20} />
          </div>
          <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>HireMind</span>
          <span className="sidebar-brand-tag">AI Placement Platform</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isAuthenticated ? (
            <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
              Go to Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-pill">
          <Sparkles size={14} />
          <span>The Complete AI Career Preparation Platform</span>
        </div>

        <h1 className="landing-title">
          Analyze your resume. Find skill gaps. <span style={{ color: "var(--primary)" }}>Get job-ready.</span>
        </h1>

        <p className="landing-subtitle">
          HireMind evaluates your resume against real job requirements, detects exact technical skill gaps, calculates placement readiness, and generates a personalized roadmap to land the offer.
        </p>

        <div className="landing-cta-group">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
          >
            <Upload size={18} />
            <span>Analyze My Resume</span>
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate(isAuthenticated ? "/job-match" : "/login")}
          >
            <Briefcase size={18} />
            <span>Compare Target Job Description</span>
          </button>
        </div>
      </section>

      {/* The 3 Core Questions Answered Section */}
      <section style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: "var(--accent-cyan)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            The HireMind Difference
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginTop: "0.5rem" }}>
            Answering Every Student's 3 Critical Questions
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <div className="card" style={{ borderTop: "4px solid var(--primary)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>
              Question 1
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: "0.35rem 0 0.75rem" }}>
              "How good is my resume?"
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Receive an in-depth deterministic 8-factor ATS score (0-100) analyzing skills density, quantifiable experience metrics, projects, and formatting.
            </p>
          </div>

          <div className="card" style={{ borderTop: "4px solid var(--accent-cyan)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--accent-cyan)", textTransform: "uppercase" }}>
              Question 2
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: "0.35rem 0 0.75rem" }}>
              "Can I get this particular job?"
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Compare your resume against any target job description to compute real-time Job Match % and segment skills into Strong (??), Partial (??), and Missing (??).
            </p>
          </div>

          <div className="card" style={{ borderTop: "4px solid var(--accent-emerald)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--accent-emerald)", textTransform: "uppercase" }}>
              Question 3
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: "0.35rem 0 0.75rem" }}>
              "What should I do to become ready for it?"
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Generate an actionable day-by-day learning roadmap and build targeted project recommendations engineered to close your exact skill gaps.
            </p>
          </div>
        </div>
      </section>

      {/* The Continuous Placement Improvement Workflow */}
      <section style={{ maxWidth: "1200px", margin: "4rem auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            The Complete Loop
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginTop: "0.5rem" }}>
            Continuous Career & Placement Acceleration
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {[
            { step: "01", title: "Resume Upload", desc: "Upload PDF or DOCX resume to extract all technical skills, projects, and credentials." },
            { step: "02", title: "Select Target Job", desc: "Paste any target job description from campus drives or portals." },
            { step: "03", title: "Detect Skill Gaps", desc: "View your granular Skill Gap Matrix and explainable Placement Readiness score." },
            { step: "04", title: "Follow Roadmap", desc: "Complete daily milestones and build gap-closing project recommendations." },
            { step: "05", title: "Re-analyze & Win", desc: "Upload your updated resume to track score progression and secure placement." },
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ position: "relative" }}>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "rgba(99, 102, 241, 0.15)", position: "absolute", top: "10px", right: "15px" }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "3rem 1.5rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        <p>? 2026 HireMind Platform ? AI Placement Preparation & Career Acceleration.</p>
      </footer>
    </div>
  );
};

export default Landing;

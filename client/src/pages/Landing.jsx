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
  CheckCircle,
  ArrowRight,
  Upload,
} from "lucide-react";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-primary)" }}>
      {/* Top Navigation */}
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
          <span className="sidebar-brand-tag">AI Intelligence</span>
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
          <span>Next-Gen Placement Preparation & ATS Analytics</span>
        </div>

        <h1 className="landing-title">
          Turn your resume into your <span style={{ color: "var(--primary)" }}>career strategy</span>.
        </h1>

        <p className="landing-subtitle">
          Analyze your resume, discover hidden skill gaps, and measure your compatibility with real-world job descriptions using deterministic ATS intelligence.
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
            <span>Compare Job Description</span>
          </button>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            How HireMind Works
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginTop: "0.5rem" }}>
            From Resume Upload to Dream Offer
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {[
            { step: "01", title: "Upload Resume", desc: "Upload your PDF or DOCX resume. Our parser extracts all structured sections, skills, and metrics." },
            { step: "02", title: "Analyze Resume", desc: "Get an instant deterministic 0-100 ATS Compatibility Score broken down into 8 transparent recruiter factors." },
            { step: "03", title: "Compare Jobs", desc: "Paste any target job description to reveal matching skills, critical missing qualifications, and keyword frequency." },
            { step: "04", title: "Improve & Apply", desc: "Follow high-impact actionable recommendations to optimize your resume and ace technical screenings." },
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "rgba(99, 102, 241, 0.15)", position: "absolute", top: "10px", right: "15px" }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Feature Matrix Grid */}
      <section className="features-grid">
        {[
          {
            icon: <Cpu />,
            title: "AI-Powered Resume Analysis",
            desc: "Extracts contact information, education credentials, GPA, work experience, projects, and certifications automatically.",
          },
          {
            icon: <ShieldCheck />,
            title: "Deterministic ATS Scoring",
            desc: "Calculates an exact 0-100 HireMind ATS score across 8 weighted factors including skills, experience, projects, and keywords.",
          },
          {
            icon: <Target />,
            title: "Skill Gap Detection",
            desc: "Identifies exactly what skills you have vs what recruiters are looking for with normalized aliases and categorized skill taxonomy.",
          },
          {
            icon: <Briefcase />,
            title: "Real-time Job Matching",
            desc: "Paste live job postings from LinkedIn, Indeed, or campus placement portals and receive instant compatibility breakdown.",
          },
          {
            icon: <TrendingUp />,
            title: "Career & Role Insights",
            desc: "Recommends high-matching target job roles (SDE, Frontend, Backend, AI/ML, DevOps) tailored to your existing skills.",
          },
          {
            icon: <FileCheck2 />,
            title: "Reports & Analysis History",
            desc: "Track your score improvement across multiple resume iterations with comprehensive audit logs and PDF export support.",
          },
        ].map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon-box">{f.icon}</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
              {f.title}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {f.desc}
            </p>
          </div>
        ))}
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
        <p>© 2026 HireMind Platform. Built for B.Tech Placement Excellence & Technical Career Acceleration.</p>
      </footer>
    </div>
  );
};

export default Landing;

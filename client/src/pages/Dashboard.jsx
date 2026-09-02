import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { analysisAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ResumeUpload from "../components/ResumeUpload";
import ProgressTracker from "../components/ProgressTracker";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FileText,
  Briefcase,
  Layers,
  History,
  TrendingUp,
  Award,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  FolderGit2,
  RefreshCw,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await analysisAPI.getDashboardStats();
      if (res?.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUploadSuccess = (data) => {
    setShowUploadModal(false);
    if (data?.analysis?.id) {
      navigate(`/analysis/${data.analysis.id}`);
    } else {
      fetchStats();
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar onOpenUpload={() => setShowUploadModal(true)} />

        <main className="page-body">
          {/* Welcome Placement Command Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              borderRadius: "var(--radius-xl)",
              padding: "1.75rem 2rem",
              marginBottom: "1.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>
                <Sparkles size={16} />
                <span>AI Placement Readiness & Career Strategy</span>
              </div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
                Welcome back, {user?.name || "Candidate"}!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
                Targeting: <strong>{user?.targetRoles?.join(", ") || "Software Engineer, Full Stack Developer"}</strong>
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                <UploadCloud size={18} />
                <span>Upload Resume</span>
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("/job-match")}>
                <Briefcase size={18} />
                <span>Analyze Target Job</span>
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Aggregating placement metrics, readiness scores, and gap records..." />
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <>
              {/* 6 Core Placement Metric Cards Grid */}
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {/* 1. Resume ATS Score */}
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-indigo">
                    <FileText size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Resume ATS Score</div>
                    <div className="stat-value">{stats?.latestScore || 0}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/100</span></div>
                    <div className="stat-subtext" style={{ color: stats?.latestScore >= 80 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                      {stats?.latestGrade || "Needs Upload"}
                    </div>
                  </div>
                </div>

                {/* 2. Placement Readiness */}
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-cyan">
                    <Award size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Placement Readiness</div>
                    <div className="stat-value">{stats?.placementReadiness || 0}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/100</span></div>
                    <div className="stat-subtext" style={{ color: "var(--accent-cyan)" }}>
                      {stats?.placementReadinessTier || "Ready for Matching"}
                    </div>
                  </div>
                </div>

                {/* 3. Job Match % */}
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-emerald">
                    <Briefcase size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Job Match Fit</div>
                    <div className="stat-value">{stats?.latestJobMatchScore || 0}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>%</span></div>
                    <div className="stat-subtext">Latest Target Job</div>
                  </div>
                </div>

                {/* 4. Skills Detected */}
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-indigo">
                    <Layers size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Skills Detected</div>
                    <div className="stat-value">{stats?.skillsDetectedCount || 0}</div>
                    <div className="stat-subtext">7 Domains Covered</div>
                  </div>
                </div>

                {/* 5. Skill Gaps */}
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-amber">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Skill Gaps</div>
                    <div className="stat-value">{stats?.skillGapsCount || 0}</div>
                    <div className="stat-subtext">Identified in Target Job</div>
                  </div>
                </div>

                {/* 6. Recommended Actions */}
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-cyan">
                    <Sparkles size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Action Items</div>
                    <div className="stat-value">{stats?.recommendedActionsCount || 7}</div>
                    <div className="stat-subtext">Roadmap & Projects</div>
                  </div>
                </div>
              </div>

              {/* Progress Over Time Multi-Metric Chart */}
              <div style={{ marginBottom: "1.75rem" }}>
                <ProgressTracker progressHistory={stats?.progressHistory || []} />
              </div>

              {/* Active Roadmap & Skill Gap Highlight Section */}
              {stats?.latestJobMatch && (
                <div className="card" style={{ marginBottom: "1.75rem", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">
                        <Calendar size={18} style={{ color: "var(--accent-emerald)" }} />
                        <span>Active Placement Roadmap ? {stats.latestJobMatch.jobTitle}</span>
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {stats.latestJobMatch.placementReadiness?.explanation || "Follow your customized daily roadmap to close identified skill gaps."}
                      </p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate("/job-match")}>
                      Open Full Roadmap <ArrowRight size={14} />
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                    {stats.latestJobMatch.roadmap?.milestones?.slice(0, 3).map((m) => (
                      <div key={m.day} style={{ background: "var(--bg-surface-elevated)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>
                          Day {m.day} ? {m.skillFocus}
                        </span>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
                          {m.title}
                        </h4>
                        <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", marginTop: "0.5rem" }}>
                          ? {m.checkpoint}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Improvement Loop Interactive Workflow */}
              <div
                style={{
                  background: "rgba(17, 24, 39, 0.75)",
                  border: "1px dashed var(--border-focus)",
                  borderRadius: "var(--radius-xl)",
                  padding: "1.5rem 2rem",
                  marginBottom: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>
                    ?? The Iterative Placement Improvement Loop
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px", maxWidth: "600px" }}>
                    1. Upload Resume ? 2. Select Job ? 3. Detect Skill Gaps ? 4. Follow Roadmap ? 5. Build Project ? 6. Update Resume & Re-analyze!
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowUploadModal(true)}>
                  <RefreshCw size={14} />
                  <span>Re-upload Updated Resume</span>
                </button>
              </div>

              {/* Recent Analyses and Saved Job Matches Tables */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* Recent Resumes */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FileText size={18} style={{ color: "var(--primary)" }} />
                      <span>Recent Resume Analyses</span>
                    </h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate("/reports")}>
                      View All
                    </button>
                  </div>

                  {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {stats.recentAnalyses.map((item) => (
                        <div
                          key={item._id}
                          style={{
                            padding: "0.75rem 1rem",
                            background: "var(--bg-surface-elevated)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate(`/analysis/${item._id}`)}
                        >
                          <div>
                            <strong style={{ fontSize: "0.9rem", color: "#fff" }}>
                              {item.extractedInfo?.personalInfo?.name || "Candidate Resume"}
                            </strong>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {new Date(item.createdAt).toLocaleDateString()} ? {item.skills?.length || 0} Skills
                            </div>
                          </div>
                          <span className={`score-grade-badge ${item.score >= 80 ? "badge-excellent" : "badge-moderate"}`}>
                            {item.score}/100
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No resumes uploaded yet.</p>
                  )}
                </div>

                {/* Recent Job Matches */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <Briefcase size={18} style={{ color: "var(--accent-cyan)" }} />
                      <span>Target Job Evaluations</span>
                    </h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate("/job-match")}>
                      New Match
                    </button>
                  </div>

                  {stats?.recentJobMatches && stats.recentJobMatches.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {stats.recentJobMatches.map((j) => (
                        <div
                          key={j._id}
                          style={{
                            padding: "0.75rem 1rem",
                            background: "var(--bg-surface-elevated)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("/job-match")}
                        >
                          <div>
                            <strong style={{ fontSize: "0.9rem", color: "#fff" }}>{j.jobTitle}</strong>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {j.company || "Target Company"} ? Readiness: {j.placementReadiness?.score || 68}/100
                            </div>
                          </div>
                          <span className={`score-grade-badge ${j.matchScore >= 80 ? "badge-excellent" : "badge-good"}`}>
                            {j.matchScore}% Fit
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No job matches analyzed yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
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
            onUploadSuccess={handleUploadSuccess}
            onClose={() => setShowUploadModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

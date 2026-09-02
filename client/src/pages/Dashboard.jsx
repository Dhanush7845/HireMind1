import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { analysisAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ResumeUpload from "../components/ResumeUpload";
import WeeklyChart from "../components/WeeklyChart";
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
  Sparkles,
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
          {/* Welcome Banner */}
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
                <span>Placement Command Intelligence</span>
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
                <span>Match Job Description</span>
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Aggregating ATS metrics and history..." />
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <>
              {/* Top Stats Metric Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-indigo">
                    <Award size={26} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">HireMind ATS Score</div>
                    <div className="stat-value">{stats?.latestScore || 0}<span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/100</span></div>
                    <div className="stat-subtext" style={{ color: stats?.latestScore >= 80 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                      {stats?.latestGrade || "No Resume Analyzed"}
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-cyan">
                    <Briefcase size={26} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Job Match Compatibility</div>
                    <div className="stat-value">{stats?.latestJobMatchScore || 0}<span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>%</span></div>
                    <div className="stat-subtext">Latest Job Analysis</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-emerald">
                    <Layers size={26} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Skills Detected</div>
                    <div className="stat-value">{stats?.skillsDetectedCount || 0}</div>
                    <div className="stat-subtext">Across All Categories</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-amber">
                    <History size={26} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Analyses Completed</div>
                    <div className="stat-value">{stats?.totalAnalyses || 0}</div>
                    <div className="stat-subtext">{stats?.totalJobMatches || 0} Job Matches</div>
                  </div>
                </div>
              </div>

              {/* Progress & Distribution Charts */}
              <div style={{ marginBottom: "1.75rem" }}>
                <WeeklyChart
                  scoreHistory={stats?.scoreHistory || []}
                  skillDistribution={stats?.skillDistribution || {}}
                />
              </div>

              {/* Recent Analyses Section */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <FileText size={18} style={{ color: "var(--primary)" }} />
                    <span>Recent Resume Analyses</span>
                  </h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate("/reports")}>
                    View All Reports <ArrowRight size={14} />
                  </button>
                </div>

                {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Candidate / Resume</th>
                          <th>ATS Score</th>
                          <th>Skills Found</th>
                          <th>Analysis Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentAnalyses.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <strong>{item.extractedInfo?.personalInfo?.name || "Candidate"}</strong>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                {item.resumeId?.originalName || "Uploaded Document"}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`score-grade-badge ${
                                  item.score >= 80 ? "badge-excellent" : item.score >= 60 ? "badge-good" : "badge-moderate"
                                }`}
                              >
                                {item.score}/100
                              </span>
                            </td>
                            <td>{item.skills?.length || 0} Skills</td>
                            <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                              {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => navigate(`/analysis/${item._id}`)}
                              >
                                View Report →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                      No resumes analyzed yet. Upload your first resume to generate intelligence.
                    </p>
                    <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                      <UploadCloud size={16} />
                      <span>Upload Your Resume</span>
                    </button>
                  </div>
                )}
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

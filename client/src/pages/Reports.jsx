import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analysisAPI, jobAPI, resumeAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FileText,
  Briefcase,
  History,
  Trash2,
  ExternalLink,
  Award,
  Search,
  Calendar,
} from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [analysesRes, jobsRes] = await Promise.all([
        analysisAPI.getAnalyses(),
        jobAPI.getJobHistory(),
      ]);

      setAnalyses(analysesRes?.data || []);
      setJobMatches(jobsRes?.data || []);
    } catch (err) {
      console.error("Reports fetch error:", err);
      setError(err.message || "Failed to load reports history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this resume and its analysis?")) {
      try {
        await resumeAPI.deleteResume(id);
        fetchReports();
      } catch (err) {
        alert(err.message || "Failed to delete resume.");
      }
    }
  };

  const handleDeleteJob = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this job match analysis?")) {
      try {
        await jobAPI.deleteJobMatch(id);
        fetchReports();
      } catch (err) {
        alert(err.message || "Failed to delete job match.");
      }
    }
  };

  const filteredAnalyses = analyses.filter((a) => {
    const term = searchTerm.toLowerCase();
    const name = a.extractedInfo?.personalInfo?.name || "";
    const originalName = a.resumeId?.originalName || "";
    return name.toLowerCase().includes(term) || originalName.toLowerCase().includes(term);
  });

  const filteredJobMatches = jobMatches.filter((j) => {
    const term = searchTerm.toLowerCase();
    const title = j.jobTitle || "";
    const company = j.company || "";
    return title.toLowerCase().includes(term) || company.toLowerCase().includes(term);
  });

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="page-body">
          <div style={{ marginBottom: "1.75rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>
              Placement Intelligence Reports & Audit History
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
              Audit your historical resume quality, job matching evaluations, and customized roadmap records.
            </p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          {/* Search & Filter Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div className="quick-fill-chips">
              <button
                className={`chip-btn ${activeTab === "all" ? "active" : ""}`}
                style={activeTab === "all" ? { background: "var(--primary)", color: "#fff" } : {}}
                onClick={() => setActiveTab("all")}
              >
                All Records ({analyses.length + jobMatches.length})
              </button>
              <button
                className={`chip-btn ${activeTab === "resumes" ? "active" : ""}`}
                style={activeTab === "resumes" ? { background: "var(--primary)", color: "#fff" } : {}}
                onClick={() => setActiveTab("resumes")}
              >
                Resume Analyses ({analyses.length})
              </button>
              <button
                className={`chip-btn ${activeTab === "jobs" ? "active" : ""}`}
                style={activeTab === "jobs" ? { background: "var(--primary)", color: "#fff" } : {}}
                onClick={() => setActiveTab("jobs")}
              >
                Job Matches & Roadmaps ({jobMatches.length})
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-surface-elevated)", padding: "0.35rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", minWidth: "260px" }}>
              <Search size={16} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search reports by role or resume..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", color: "#fff", width: "100%", fontSize: "0.85rem" }}
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading placement audit reports..." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Resume Analyses Table */}
              {(activeTab === "all" || activeTab === "resumes") && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FileText size={18} style={{ color: "var(--primary)" }} />
                      <span>Resume ATS Evaluations ({filteredAnalyses.length})</span>
                    </h3>
                  </div>

                  {filteredAnalyses.length > 0 ? (
                    <div className="table-responsive">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Document & Candidate</th>
                            <th>ATS Score</th>
                            <th>Skills</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAnalyses.map((a) => (
                            <tr key={a._id} style={{ cursor: "pointer" }} onClick={() => navigate(`/analysis/${a._id}`)}>
                              <td>
                                <strong>{a.extractedInfo?.personalInfo?.name || "Candidate"}</strong>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                  {a.resumeId?.originalName || "Uploaded File"}
                                </div>
                              </td>
                              <td>
                                <span className={`score-grade-badge ${a.score >= 80 ? "badge-excellent" : a.score >= 60 ? "badge-good" : "badge-moderate"}`}>
                                  {a.score}/100
                                </span>
                              </td>
                              <td>{a.skills?.length || 0} Skills</td>
                              <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                                {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/analysis/${a._id}`);
                                    }}
                                  >
                                    View Report ?
                                  </button>
                                  {a.resumeId?._id && (
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={(e) => handleDeleteResume(a.resumeId._id, e)}
                                      title="Delete Resume Record"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)", padding: "1.5rem 0", textAlign: "center" }}>
                      No resume reports found.
                    </p>
                  )}
                </div>
              )}

              {/* Job Matches & Placement Roadmaps Table */}
              {(activeTab === "all" || activeTab === "jobs") && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <Briefcase size={18} style={{ color: "var(--accent-cyan)" }} />
                      <span>Target Job Matches & Roadmaps ({filteredJobMatches.length})</span>
                    </h3>
                  </div>

                  {filteredJobMatches.length > 0 ? (
                    <div className="table-responsive">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Target Role & Company</th>
                            <th>Job Match Fit</th>
                            <th>Placement Readiness</th>
                            <th>Skill Gaps</th>
                            <th>Roadmap Duration</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredJobMatches.map((j) => (
                            <tr key={j._id}>
                              <td>
                                <strong>{j.jobTitle}</strong>
                                {j.company && (
                                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                    {j.company}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className={`score-grade-badge ${j.matchScore >= 80 ? "badge-excellent" : j.matchScore >= 60 ? "badge-good" : "badge-moderate"}`}>
                                  {j.matchScore}% Fit
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: "var(--accent-cyan)", fontSize: "0.95rem" }}>
                                  {j.placementReadiness?.score || 68}/100
                                </strong>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                  {j.placementReadiness?.tier || "Ready for Prep"}
                                </div>
                              </td>
                              <td>
                                <span style={{ color: "var(--accent-emerald)", fontWeight: 700 }}>{j.strongMatches?.length || j.matchedSkills?.length || 0} Strong</span> /{" "}
                                <span style={{ color: "var(--accent-rose)", fontWeight: 700 }}>{j.missingMatches?.length || j.missingSkills?.length || 0} Missing</span>
                              </td>
                              <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                                {j.roadmap?.totalDays ? `${j.roadmap.totalDays} Days Plan` : "7-Day Roadmap"}
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => navigate("/job-match")}
                                  >
                                    Open Roadmap ?
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={(e) => handleDeleteJob(j._id, e)}
                                    title="Delete Job Record"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)", padding: "1.5rem 0", textAlign: "center" }}>
                      No job matching or roadmap records found.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;

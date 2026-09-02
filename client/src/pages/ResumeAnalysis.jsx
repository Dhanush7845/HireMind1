import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { analysisAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ResumeScore from "../components/ResumeScore";
import SkillCard from "../components/SkillCard";
import AnalysisCard from "../components/AnalysisCard";
import RecommendationCard from "../components/RecommendationCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ResumeUpload from "../components/ResumeUpload";
import {
  FileText,
  Sparkles,
  Printer,
  Upload,
  Briefcase,
  AlertCircle,
  Calendar,
  CheckCircle,
} from "lucide-react";

const ResumeAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      if (id) {
        const res = await analysisAPI.getAnalysisById(id);
        setAnalysis(res?.data || null);
      } else {
        // Fetch latest analysis
        const res = await analysisAPI.getAnalyses();
        if (res?.data && res.data.length > 0) {
          setAnalysis(res.data[0]);
        } else {
          setAnalysis(null);
        }
      }
    } catch (err) {
      console.error("Fetch analysis error:", err);
      setError(err.message || "Failed to load resume analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const handleUploadSuccess = (data) => {
    setShowUploadModal(false);
    if (data?.analysis?.id) {
      navigate(`/analysis/${data.analysis.id}`);
    } else {
      fetchAnalysis();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar onOpenUpload={() => setShowUploadModal(true)} />

        <main className="page-body">
          {loading ? (
            <LoadingSpinner message="Retrieving structured resume analysis..." />
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : !analysis ? (
            <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <FileText size={48} style={{ color: "var(--primary)", margin: "0 auto 1rem" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>No Resume Analysis Found</h2>
              <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0.5rem auto 1.5rem" }}>
                Upload a resume in PDF or DOCX format to receive an in-depth ATS evaluation report.
              </p>
              <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                <Upload size={16} />
                <span>Upload Resume</span>
              </button>
            </div>
          ) : (
            <>
              {/* Header Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "1.75rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    <Calendar size={14} />
                    <span>
                      Analyzed on {new Date(analysis.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    <span>•</span>
                    <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                      {analysis.resumeId?.originalName || "Uploaded Resume"}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
                    {analysis.extractedInfo?.personalInfo?.name || "Candidate"} — Resume Intelligence
                  </h2>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                    <Printer size={16} />
                    <span>Print / PDF Export</span>
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate("/job-match")}>
                    <Briefcase size={16} />
                    <span>Match Against Job</span>
                  </button>
                </div>
              </div>

              {/* Two Column Intelligence Layout */}
              <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "1.5rem", alignItems: "start" }}>
                {/* Left Column: ATS Score & Recommendations */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <ResumeScore
                    score={analysis.score}
                    grade={analysis.grade}
                    breakdown={analysis.scoreBreakdown}
                  />

                  {/* Recommended Target Roles Card */}
                  {analysis.recommendedRoles && analysis.recommendedRoles.length > 0 && (
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">
                          <Sparkles size={18} style={{ color: "var(--accent-cyan)" }} />
                          <span>Recommended Target Roles</span>
                        </h3>
                      </div>
                      <div className="skill-tags-flex">
                        {analysis.recommendedRoles.map((role, idx) => (
                          <span key={idx} className="skill-tag" style={{ background: "rgba(6, 182, 212, 0.12)", color: "#22d3ee", borderColor: "rgba(6, 182, 212, 0.3)" }}>
                            ⭐ {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Skills, Info, Experience, Education, Projects & Plan */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <SkillCard
                    skillsByCategory={analysis.skillsByCategory || {}}
                    totalSkills={analysis.skills?.length || 0}
                  />

                  <RecommendationCard
                    recommendations={analysis.recommendations || []}
                    strengths={analysis.strengths || []}
                    weaknesses={analysis.weaknesses || []}
                  />

                  <AnalysisCard extractedInfo={analysis.extractedInfo || {}} />
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

export default ResumeAnalysis;

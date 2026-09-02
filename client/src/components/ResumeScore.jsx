import React from "react";

const ResumeScore = ({ score = 0, grade = "", breakdown = {} }) => {
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return "#10b981"; // Emerald
    if (score >= 65) return "#06b6d4"; // Cyan
    if (score >= 50) return "#f59e0b"; // Amber
    return "#f43f5e"; // Rose
  };

  const getBadgeClass = () => {
    if (score >= 80) return "badge-excellent";
    if (score >= 65) return "badge-good";
    if (score >= 50) return "badge-moderate";
    return "badge-low";
  };

  const breakdownItems = [
    { label: "Skills Relevance & Density", score: breakdown.skillsScore ?? 0, max: 25 },
    { label: "Work Experience Quality", score: breakdown.experienceScore ?? 0, max: 20 },
    { label: "Technical Projects Depth", score: breakdown.projectsScore ?? 0, max: 15 },
    { label: "Education & Credentials", score: breakdown.educationScore ?? 0, max: 10 },
    { label: "Resume Structure & Sections", score: breakdown.structureScore ?? 0, max: 10 },
    { label: "Keyword & Action Verbs", score: breakdown.keywordsScore ?? 0, max: 10 },
    { label: "Contact Information", score: breakdown.contactScore ?? 0, max: 5 },
    { label: "Certifications", score: breakdown.certificationsScore ?? 0, max: 5 },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">HireMind ATS Compatibility Score</h3>
        <span className={`score-grade-badge ${getBadgeClass()}`}>
          {grade || (score >= 80 ? "ATS Ready" : score >= 60 ? "Competitive" : "Needs Optimization")}
        </span>
      </div>

      <div className="score-circle-wrapper">
        <svg width={size} height={size} className="score-svg">
          <circle
            className="score-bg-circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="score-fill-circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={getScoreColor()}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="score-center-text">
          <div className="score-number">{score}</div>
          <div className="score-unit">/ 100</div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
          Deterministic 8-Factor Score Breakdown
        </h4>

        <div className="breakdown-list">
          {breakdownItems.map((item, idx) => {
            const percentage = Math.round((item.score / item.max) * 100);
            return (
              <div key={idx} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">{item.label}</span>
                  <span className="breakdown-score">
                    <strong>{item.score}</strong> / {item.max} pts ({percentage}%)
                  </span>
                </div>
                <div className="breakdown-bar-bg">
                  <div
                    className="breakdown-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      background:
                        percentage >= 80
                          ? "var(--gradient-emerald)"
                          : percentage >= 50
                          ? "var(--gradient-primary)"
                          : "var(--gradient-amber)",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResumeScore;

import React from "react";
import { Briefcase, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

const JobMatchCard = ({ matchData = {} }) => {
  const {
    jobTitle = "Software Developer",
    company = "Tech Company",
    matchScore = 0,
    matchCategory = "",
    matchedSkills = [],
    missingSkills = [],
    explanation = "",
    recommendations = [],
    keywordMatches = [],
  } = matchData;

  const getScoreBadge = () => {
    if (matchScore >= 80) return "badge-excellent";
    if (matchScore >= 60) return "badge-good";
    if (matchScore >= 40) return "badge-moderate";
    return "badge-low";
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title" style={{ fontSize: "1.2rem" }}>
            <Briefcase size={20} style={{ color: "var(--primary)" }} />
            <span>{jobTitle}</span>
          </h3>
          {company && <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>{company}</p>}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
            {matchScore}%
          </div>
          <span className={`score-grade-badge ${getScoreBadge()}`}>
            {matchCategory || `${matchScore}% Compatibility`}
          </span>
        </div>
      </div>

      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        {explanation}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div>
          <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-emerald)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            ✓ Verified Skills ({matchedSkills.length})
          </h4>
          <div className="skill-tags-flex">
            {matchedSkills.map((s, i) => (
              <span key={i} className="skill-tag skill-tag-matched">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-amber)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            ! Skill Gaps to Address ({missingSkills.length})
          </h4>
          <div className="skill-tags-flex">
            {missingSkills.map((s, i) => (
              <span key={i} className="skill-tag skill-tag-missing">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
            Tailoring Recommendations for this Opportunity
          </h4>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {recommendations.map((rec, i) => (
              <li key={i} style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobMatchCard;

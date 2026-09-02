import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Filter } from "lucide-react";

const SkillGapMatrix = ({ skillGaps = [], strongCount = 0, partialCount = 0, missingCount = 0 }) => {
  const [filter, setFilter] = useState("all");

  const filtered = skillGaps.filter((item) => {
    if (filter === "strong") return item.resumeStatus === "Strong";
    if (filter === "partial") return item.resumeStatus === "Needs Improvement";
    if (filter === "missing") return item.resumeStatus === "Missing";
    return true;
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <span>Skill Gap Analysis Matrix</span>
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            Granular comparison of your resume skills against required & preferred job criteria.
          </p>
        </div>

        <div className="quick-fill-chips">
          <button
            className={`chip-btn ${filter === "all" ? "active" : ""}`}
            style={filter === "all" ? { background: "var(--primary)", color: "#fff" } : {}}
            onClick={() => setFilter("all")}
          >
            All Skills ({skillGaps.length})
          </button>
          <button
            className={`chip-btn ${filter === "strong" ? "active" : ""}`}
            style={filter === "strong" ? { background: "var(--accent-emerald)", color: "#fff" } : {}}
            onClick={() => setFilter("strong")}
          >
            ?? Strong ({strongCount})
          </button>
          <button
            className={`chip-btn ${filter === "partial" ? "active" : ""}`}
            style={filter === "partial" ? { background: "var(--accent-amber)", color: "#000" } : {}}
            onClick={() => setFilter("partial")}
          >
            ?? Needs Work ({partialCount})
          </button>
          <button
            className={`chip-btn ${filter === "missing" ? "active" : ""}`}
            style={filter === "missing" ? { background: "var(--accent-rose)", color: "#fff" } : {}}
            onClick={() => setFilter("missing")}
          >
            ?? Missing ({missingCount})
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Skill / Technology</th>
              <th>Resume Status</th>
              <th>Job Requirement</th>
              <th>Gap Level</th>
              <th>Recruiter Rationale</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <strong style={{ fontSize: "0.95rem", color: "#fff" }}>{item.skill}</strong>
                </td>
                <td>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "3px 9px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      background:
                        item.resumeStatus === "Strong"
                          ? "rgba(16, 185, 129, 0.15)"
                          : item.resumeStatus === "Needs Improvement"
                          ? "rgba(245, 158, 11, 0.15)"
                          : "rgba(244, 63, 94, 0.15)",
                      color:
                        item.resumeStatus === "Strong"
                          ? "#34d399"
                          : item.resumeStatus === "Needs Improvement"
                          ? "#fbbf24"
                          : "#f87171",
                    }}
                  >
                    {item.statusBadge}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: item.jobRequirement === "Required" ? "#fff" : "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.jobRequirement}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color:
                        item.gapLevel === "High"
                          ? "var(--accent-rose)"
                          : item.gapLevel === "Medium"
                          ? "var(--accent-amber)"
                          : "var(--accent-emerald)",
                    }}
                  >
                    {item.gapLevel}
                  </span>
                </td>
                <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "340px", lineHeight: 1.5 }}>
                  {item.rationale}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkillGapMatrix;

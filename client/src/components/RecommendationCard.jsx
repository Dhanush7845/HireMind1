import React from "react";
import { Lightbulb, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

const RecommendationCard = ({ recommendations = [], strengths = [], weaknesses = [] }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Strengths & Weaknesses Split Card */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: "var(--accent-emerald)" }}>
              <ShieldCheck size={18} />
              <span>Key Strengths ({strengths.length})</span>
            </h3>
          </div>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {strengths.map((str, idx) => (
              <li key={idx} style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: "var(--accent-rose)" }}>
              <AlertTriangle size={18} />
              <span>ATS Weaknesses ({weaknesses.length})</span>
            </h3>
          </div>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {weaknesses.map((weak, idx) => (
              <li key={idx} style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {weak}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Recommendations Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Lightbulb size={18} style={{ color: "var(--accent-amber)" }} />
            <span>Actionable ATS Optimization Plan ({recommendations.length})</span>
          </h3>
          <span className="sidebar-brand-tag">Impact Ranked</span>
        </div>

        <div className="recommendations-list">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`rec-card ${
                rec.priority === "High"
                  ? "rec-card-high"
                  : rec.priority === "Medium"
                  ? "rec-card-medium"
                  : "rec-card-low"
              }`}
            >
              <div className="rec-top">
                <span className="rec-title">{rec.title}</span>
                <span
                  className="rec-priority-badge"
                  style={{
                    background:
                      rec.priority === "High"
                        ? "rgba(244, 63, 94, 0.15)"
                        : rec.priority === "Medium"
                        ? "rgba(245, 158, 11, 0.15)"
                        : "rgba(16, 185, 129, 0.15)",
                    color:
                      rec.priority === "High"
                        ? "#f87171"
                        : rec.priority === "Medium"
                        ? "#fbbf24"
                        : "#34d399",
                  }}
                >
                  {rec.priority} Priority
                </span>
              </div>
              <p className="rec-action">{rec.action}</p>
              {rec.impact && <div className="rec-impact">Expected Gain: {rec.impact}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;

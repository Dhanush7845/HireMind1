import React from "react";
import { Award, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const PlacementReadinessCard = ({ readiness = {} }) => {
  const {
    score = 68,
    tier = "Close to Ready ? Minor Gaps",
    tierBadge = "badge-good",
    explanation = "",
    breakdown = {},
  } = readiness;

  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return "#10b981";
    if (score >= 65) return "#06b6d4";
    if (score >= 45) return "#f59e0b";
    return "#f43f5e";
  };

  const categories = Object.values(breakdown);

  return (
    <div className="card" style={{ border: "1px solid rgba(99, 102, 241, 0.3)" }}>
      <div className="card-header">
        <h3 className="card-title">
          <Award size={20} style={{ color: "var(--accent-cyan)" }} />
          <span>Placement Readiness Score</span>
        </h3>
        <span className={`score-grade-badge ${tierBadge}`}>{tier}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1.5rem", alignItems: "center" }}>
        <div className="score-circle-wrapper" style={{ padding: 0 }}>
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
            <div className="score-number" style={{ fontSize: "2.3rem" }}>
              {score}
            </div>
            <div className="score-unit">/ 100</div>
          </div>
        </div>

        <div>
          <div
            style={{
              background: "rgba(99, 102, 241, 0.08)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem 1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>
              <Sparkles size={14} />
              <span>Placement Explainability Insight</span>
            </div>
            <p style={{ color: "var(--text-primary)", fontSize: "0.85rem", marginTop: "0.35rem", lineHeight: 1.5 }}>
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
          <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
            Placement Readiness Dimension Weights
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
            {categories.map((cat, idx) => {
              const pct = Math.round((cat.score / cat.max) * 100);
              return (
                <div key={idx} style={{ background: "var(--bg-surface-elevated)", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{cat.label}</span>
                    <strong style={{ color: "#fff" }}>
                      {cat.score}/{cat.max} pts
                    </strong>
                  </div>
                  <div className="breakdown-bar-bg" style={{ height: "6px" }}>
                    <div
                      className="breakdown-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct >= 80
                            ? "var(--gradient-emerald)"
                            : pct >= 50
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
      )}
    </div>
  );
};

export default PlacementReadinessCard;

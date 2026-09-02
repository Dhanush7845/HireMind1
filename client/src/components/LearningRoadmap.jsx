import React, { useState } from "react";
import { Calendar, CheckCircle2, ChevronRight, Target, Sparkles, BookOpen } from "lucide-react";

const LearningRoadmap = ({ roadmap = {} }) => {
  const { totalDays = 7, targetJobTitle = "", skillsCovered = [], summary = "", milestones = [] } = roadmap;
  const [completedDays, setCompletedDays] = useState([]);

  const toggleDay = (day) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const progressPercent = milestones.length > 0 ? Math.round((completedDays.length / milestones.length) * 100) : 0;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Calendar size={18} style={{ color: "var(--accent-emerald)" }} />
            <span>Personalized {totalDays}-Day Learning Roadmap</span>
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            {summary || "Step-by-step roadmap specifically targeting your missing and weak skills."}
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-emerald)" }}>
            {progressPercent}% Done
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {completedDays.length} of {milestones.length} Days Completed
          </span>
        </div>
      </div>

      {skillsCovered.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Skills Addressed:
          </span>
          {skillsCovered.map((s, i) => (
            <span key={i} className="skill-tag" style={{ background: "rgba(99, 102, 241, 0.12)", color: "#a5b4fc", borderColor: "rgba(99, 102, 241, 0.3)" }}>
              ?? {s}
            </span>
          ))}
        </div>
      )}

      {/* Day by Day Milestones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {milestones.map((m) => {
          const isDone = completedDays.includes(m.day);
          return (
            <div
              key={m.day}
              style={{
                background: isDone ? "rgba(16, 185, 129, 0.06)" : "var(--bg-surface-elevated)",
                border: `1px solid ${isDone ? "rgba(16, 185, 129, 0.3)" : "var(--border-subtle)"}`,
                borderRadius: "var(--radius-lg)",
                padding: "1.1rem 1.25rem",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button
                    onClick={() => toggleDay(m.day)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: `2px solid ${isDone ? "var(--accent-emerald)" : "var(--text-muted)"}`,
                      background: isDone ? "var(--accent-emerald)" : "transparent",
                      color: isDone ? "#fff" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                    title="Mark Day as Complete"
                  >
                    ?
                  </button>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Day {m.day} ? {m.skillFocus}
                      </span>
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: isDone ? "#94a3b8" : "#fff", textDecoration: isDone ? "line-through" : "none" }}>
                      {m.title}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Topics Pills */}
              {m.topics && m.topics.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", margin: "0.75rem 0 0.5rem 2.5rem" }}>
                  {m.topics.map((t, ti) => (
                    <span key={ti} style={{ fontSize: "0.75rem", background: "var(--bg-main)", color: "var(--text-secondary)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                      ? {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Actionable Tasks */}
              {m.tasks && m.tasks.length > 0 && (
                <ul style={{ paddingLeft: "3.75rem", margin: "0.5rem 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {m.tasks.map((task, ti) => (
                    <li key={ti} style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {task}
                    </li>
                  ))}
                </ul>
              )}

              {/* Checkpoint */}
              {m.checkpoint && (
                <div style={{ marginLeft: "2.5rem", marginTop: "0.5rem", padding: "0.4rem 0.75rem", background: "rgba(99, 102, 241, 0.08)", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--primary)", fontSize: "0.8rem", color: "#a5b4fc" }}>
                  <strong>Checkpoint:</strong> {m.checkpoint}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningRoadmap;

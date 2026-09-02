import React from "react";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

const SkillGap = ({ matchedSkills = [], missingSkills = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <span>Skill Gap Intelligence</span>
        </h3>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {matchedSkills.length} Matched / {missingSkills.length} Missing
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Matched Skills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-emerald)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>
            <CheckCircle2 size={16} />
            <span>Matching Skills ({matchedSkills.length})</span>
          </div>

          <div className="skill-tags-flex">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, idx) => (
                <span key={idx} className="skill-tag skill-tag-matched">
                  ✓ {skill}
                </span>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                No matching skills found.
              </p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-amber)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>
            <AlertTriangle size={16} />
            <span>Missing / Target Skills ({missingSkills.length})</span>
          </div>

          <div className="skill-tags-flex">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, idx) => (
                <span key={idx} className="skill-tag skill-tag-missing">
                  ! {skill}
                </span>
              ))
            ) : (
              <p style={{ color: "var(--accent-emerald)", fontSize: "0.85rem", fontWeight: 600 }}>
                100% Skill coverage! No missing requirements.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;

import React, { useState } from "react";
import { FolderGit2, Check, Copy, Sparkles, ArrowUpRight } from "lucide-react";

const ProjectRecommendations = ({ projects = [] }) => {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <FolderGit2 size={18} style={{ color: "var(--secondary)" }} />
            <span>Targeted Gap-Closing Project Recommendations ({projects.length})</span>
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            Build these specific projects to master your missing skills and create high-impact resume artifacts.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {projects.map((proj, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>
                  {proj.title}
                </h4>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                {proj.description}
              </p>

              {/* Skills Addressed */}
              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-emerald)", textTransform: "uppercase" }}>
                  Gaps Closed:
                </span>
                <div className="skill-tags-flex" style={{ marginTop: "0.25rem" }}>
                  {proj.skillsAddressed?.map((s, si) => (
                    <span key={si} className="skill-tag skill-tag-matched" style={{ fontSize: "0.75rem", padding: "2px 7px" }}>
                      ? {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Recommended Tech Stack:
                </span>
                <div className="skill-tags-flex" style={{ marginTop: "0.25rem" }}>
                  {proj.technologies?.map((t, ti) => (
                    <span key={ti} className="skill-tag" style={{ fontSize: "0.75rem", padding: "2px 7px" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Features to Build */}
              {proj.features && proj.features.length > 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Key Implementation Features:
                  </span>
                  <ul style={{ paddingLeft: "1.2rem", marginTop: "0.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    {proj.features.map((f, fi) => (
                      <li key={fi} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
              {proj.impactOnMatch && (
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--accent-cyan)", marginBottom: "0.5rem" }}>
                  ? {proj.impactOnMatch}
                </div>
              )}

              {proj.resumeBulletExample && (
                <div style={{ background: "var(--bg-main)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      ATS Resume Bullet to Add:
                    </span>
                    <button
                      className="chip-btn"
                      style={{ padding: "1px 6px", fontSize: "0.65rem" }}
                      onClick={() => handleCopyBullet(proj.resumeBulletExample, idx)}
                    >
                      {copiedIdx === idx ? "? Copied!" : "Copy Bullet"}
                    </button>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                    "{proj.resumeBulletExample}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectRecommendations;

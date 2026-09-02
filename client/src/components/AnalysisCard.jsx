import React from "react";
import { User, GraduationCap, Briefcase, FolderGit2, Award } from "lucide-react";

const AnalysisCard = ({ extractedInfo = {} }) => {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    projects = [],
    certifications = [],
  } = extractedInfo;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Personal Info Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <User size={18} style={{ color: "var(--primary)" }} />
            <span>Candidate Information</span>
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Candidate Name</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{personalInfo.name || "N/A"}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Email Address</div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{personalInfo.email || "N/A"}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Phone Number</div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{personalInfo.phone || "N/A"}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>LinkedIn / GitHub</div>
            <div style={{ fontSize: "0.85rem", display: "flex", gap: "0.5rem" }}>
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>
                  LinkedIn ↗
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noreferrer" style={{ color: "var(--accent-cyan)" }}>
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Briefcase size={18} style={{ color: "var(--accent-cyan)" }} />
            <span>Work & Internship Experience ({experience.length})</span>
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {experience.length > 0 ? (
            experience.map((exp, idx) => (
              <div key={idx} style={{ padding: "0.75rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>{exp.role}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--primary)" }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "var(--bg-main)", padding: "2px 8px", borderRadius: "4px" }}>
                    {exp.duration}
                  </span>
                </div>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {exp.responsibilities.map((r, ri) => (
                      <li key={ri} style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No direct work experience entries detected.</p>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <FolderGit2 size={18} style={{ color: "var(--secondary)" }} />
            <span>Technical Projects ({projects.length})</span>
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {projects.length > 0 ? (
            projects.map((proj, idx) => (
              <div key={idx} style={{ padding: "1rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "0.35rem" }}>
                  {proj.name}
                </h4>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="skill-tags-flex" style={{ marginBottom: "0.5rem" }}>
                    {proj.technologies.map((t, ti) => (
                      <span key={ti} className="skill-tag" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {proj.description || "Demonstrates engineering problem solving and software deployment."}
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No projects detected.</p>
          )}
        </div>
      </div>

      {/* Education & Certifications Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <GraduationCap size={18} style={{ color: "var(--accent-emerald)" }} />
              <span>Education</span>
            </h3>
          </div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: "0.75rem" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{edu.degree}</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{edu.college}</p>
              <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", marginTop: "2px" }}>
                {edu.cgpa && <span>Score: {edu.cgpa} • </span>}
                <span>Graduation: {edu.graduationYear || "2024"}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Award size={18} style={{ color: "var(--accent-amber)" }} />
              <span>Certifications</span>
            </h3>
          </div>
          {certifications.length > 0 ? (
            certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: "0.75rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{cert.name}</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{cert.issuer}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No certifications listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;

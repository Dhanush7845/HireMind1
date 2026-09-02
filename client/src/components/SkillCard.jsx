import React, { useState } from "react";
import { Code, Layers, Database, Cloud, Cpu, Wrench, Binary, Sparkles } from "lucide-react";

const CATEGORY_ICONS = {
  programmingLanguages: <Code size={16} />,
  frameworks: <Layers size={16} />,
  databases: <Database size={16} />,
  cloudAndDevops: <Cloud size={16} />,
  aiAndData: <Cpu size={16} />,
  tools: <Wrench size={16} />,
  coreCs: <Binary size={16} />,
  other: <Sparkles size={16} />,
};

const CATEGORY_NAMES = {
  programmingLanguages: "Programming Languages",
  frameworks: "Frameworks & Libraries",
  databases: "Databases & Storage",
  cloudAndDevops: "Cloud & DevOps",
  aiAndData: "AI / ML & Data Science",
  tools: "Tools & Platforms",
  coreCs: "Core CS & Methodologies",
  other: "Other Technologies",
};

const SkillCard = ({ skillsByCategory = {}, totalSkills = 0 }) => {
  const [activeTab, setActiveTab] = useState("all");

  const categories = Object.keys(skillsByCategory).filter(
    (cat) => Array.isArray(skillsByCategory[cat]) && skillsByCategory[cat].length > 0
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Code size={18} style={{ color: "var(--primary)" }} />
          <span>Extracted Technical Skills ({totalSkills})</span>
        </h3>
        <span className="sidebar-brand-tag">Categorized Taxonomy</span>
      </div>

      <div className="quick-fill-chips" style={{ marginBottom: "1.25rem" }}>
        <button
          className={`chip-btn ${activeTab === "all" ? "active" : ""}`}
          style={activeTab === "all" ? { background: "var(--primary)", color: "#fff" } : {}}
          onClick={() => setActiveTab("all")}
        >
          All Skills ({totalSkills})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip-btn ${activeTab === cat ? "active" : ""}`}
            style={activeTab === cat ? { background: "var(--primary)", color: "#fff" } : {}}
            onClick={() => setActiveTab(cat)}
          >
            {CATEGORY_NAMES[cat] || cat} ({skillsByCategory[cat].length})
          </button>
        ))}
      </div>

      <div className="skills-container">
        {categories
          .filter((cat) => activeTab === "all" || activeTab === cat)
          .map((cat) => (
            <div key={cat} className="skill-category-group">
              <div className="skill-category-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {CATEGORY_ICONS[cat] || <Sparkles size={14} />}
                <span>{CATEGORY_NAMES[cat] || cat}</span>
              </div>
              <div className="skill-tags-flex">
                {skillsByCategory[cat].map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

        {totalSkills === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No technical skills detected yet. Upload a resume to populate skills.
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillCard;

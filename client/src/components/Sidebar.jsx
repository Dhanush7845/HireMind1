import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  History,
  UserCheck,
  Sparkles,
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand-icon">
          <Sparkles size={20} />
        </div>
        <div className="sidebar-brand-text">HireMind</div>
        <span className="sidebar-brand-tag">AI ATS</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Core Intelligence</div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <LayoutDashboard size={18} className="sidebar-link-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <FileSearch size={18} className="sidebar-link-icon" />
          <span>Resume Analysis</span>
        </NavLink>

        <NavLink
          to="/job-match"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <Briefcase size={18} className="sidebar-link-icon" />
          <span>Job Matcher</span>
        </NavLink>

        <div className="sidebar-section-title" style={{ marginTop: "1rem" }}>
          Records & Profile
        </div>

        <NavLink
          to="/reports"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <History size={18} className="sidebar-link-icon" />
          <span>Reports & History</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <UserCheck size={18} className="sidebar-link-icon" />
          <span>Profile & Target Roles</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-pro-card">
          <h4>Recruiter Placement Ready</h4>
          <p>Deterministic 8-factor ATS scoring engine with skill gap intelligence.</p>
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: "100%" }}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

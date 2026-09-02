import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Upload,
  Briefcase,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";

const Navbar = ({ onOpenUpload }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Command Dashboard";
      case "/analysis":
        return "Resume Intelligence";
      case "/job-match":
        return "Job Description Matcher";
      case "/reports":
        return "Analysis Reports & History";
      case "/profile":
        return "Candidate Profile & Settings";
      default:
        return "HireMind Intelligence";
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-page-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        {onOpenUpload && (
          <button className="navbar-btn navbar-btn-primary" onClick={onOpenUpload}>
            <Upload size={16} />
            <span>Upload Resume</span>
          </button>
        )}

        <button
          className="navbar-btn navbar-btn-secondary"
          onClick={() => navigate("/job-match")}
        >
          <Briefcase size={16} />
          <span>Match Job</span>
        </button>

        <div className="user-profile-pill" onClick={() => navigate("/profile")} title="View Profile">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="user-pill-name">{user?.name || "Candidate"}</span>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

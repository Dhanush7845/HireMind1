import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  User,
  Shield,
  Key,
  Save,
  CheckCircle,
  AlertCircle,
  Calendar,
  Layers,
  Award,
} from "lucide-react";

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [targetRolesInput, setTargetRolesInput] = useState(
    user?.targetRoles ? user.targetRoles.join(", ") : "Software Engineer, Full Stack Developer"
  );
  const [skillsInput, setSkillsInput] = useState(
    user?.skills ? user.skills.join(", ") : "JavaScript, React, Node.js, Python, MongoDB"
  );
  const [bio, setBio] = useState(user?.bio || "");

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const res = await userAPI.getProfile();
        if (res?.data) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Profile stats error:", err);
      }
    };

    fetchProfileStats();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess("");
    setProfileError("");

    try {
      const targetRoles = targetRolesInput
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

      const skills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile({
        name,
        email,
        targetRoles,
        skills,
        bio,
      });

      setProfileSuccess("Candidate profile updated successfully!");
    } catch (err) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordSaving(true);
    setPasswordSuccess("");
    setPasswordError("");

    try {
      await userAPI.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="page-body">
          <div style={{ marginBottom: "1.75rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>
              Candidate Profile & Preferences
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
              Configure your career target roles, baseline skills, and security credentials.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Left: Candidate Information & Career Target Form */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <User size={18} style={{ color: "var(--primary)" }} />
                  <span>Personal & Career Preferences</span>
                </h3>
              </div>

              {profileSuccess && <div className="alert-success">{profileSuccess}</div>}
              {profileError && <div className="alert-error">{profileError}</div>}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Job Roles (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Software Engineer, Full Stack Developer, SDE-1"
                    value={targetRolesInput}
                    onChange={(e) => setTargetRolesInput(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Key Core Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Java, Python, React, Node.js, AWS, Docker"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Summary / Headline</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: "80px", resize: "vertical" }}
                    placeholder="Final year computer science engineering candidate with expertise in full-stack web applications..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={profileSaving}>
                  {profileSaving ? "Saving Profile..." : "Save Profile Changes"}
                </button>
              </form>
            </div>

            {/* Right: Security & Overview Card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Account Overview Stats */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Award size={18} style={{ color: "var(--accent-emerald)" }} />
                    <span>Account Placement Summary</span>
                  </h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ padding: "0.75rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Member Since</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "2026"}
                    </div>
                  </div>

                  <div style={{ padding: "0.75rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Resumes Ingested</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
                      {stats?.resumesCount ?? 1} Documents
                    </div>
                  </div>

                  <div style={{ padding: "0.75rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Job Matches Ran</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
                      {stats?.jobMatchesCount ?? 0} Comparisons
                    </div>
                  </div>

                  <div style={{ padding: "0.75rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Latest ATS Score</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-emerald)", marginTop: "2px" }}>
                      {stats?.latestScore ?? 0}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Key size={18} style={{ color: "var(--accent-amber)" }} />
                    <span>Security & Password</span>
                  </h3>
                </div>

                {passwordSuccess && <div className="alert-success">{passwordSuccess}</div>}
                {passwordError && <div className="alert-error">{passwordError}</div>}

                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password (Min 6 chars)</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-secondary" style={{ width: "100%" }} disabled={passwordSaving}>
                    {passwordSaving ? "Updating Password..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("alex.morgan@example.com");
    setPassword("HireMind2026!");
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div className="sidebar-brand-icon" style={{ margin: "0 auto 1rem", width: 44, height: 44 }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>Welcome to HireMind</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Sign in to access your Resume Intelligence Dashboard
          </p>
        </div>

        {searchParams.get("expired") && (
          <div className="alert-error" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <AlertCircle size={16} />
            <span>Your session expired. Please sign in again.</span>
          </div>
        )}

        {formError && (
          <div className="alert-error" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="candidate@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={submitting}>
            {submitting ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
          <button
            type="button"
            className="chip-btn"
            onClick={handleDemoFill}
            style={{ width: "100%", padding: "0.6rem", background: "rgba(99, 102, 241, 0.1)", color: "#a5b4fc" }}
          >
            ⚡ Quick Demo Fill (Alex Morgan)
          </button>
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from "react";

const LoadingSpinner = ({ message = "Analyzing resume with AI intelligence...", size = "default" }) => {
  return (
    <div className="loading-container">
      <div className="spinner" style={size === "large" ? { width: 56, height: 56, borderWidth: 4 } : {}}></div>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;

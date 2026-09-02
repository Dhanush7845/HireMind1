import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { resumeAPI } from "../services/api";

const ResumeUpload = ({ onUploadSuccess, onClose }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    const validExtensions = ["pdf", "docx", "doc", "txt"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError("Please select a PDF, DOCX, DOC, or TXT resume file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller resume document.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select or drop a resume file first.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadStep("Uploading resume document...");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setTimeout(() => setUploadStep("Extracting text and structure..."), 600);
      setTimeout(() => setUploadStep("Running deterministic ATS scoring & skill intelligence..."), 1200);

      const res = await resumeAPI.uploadResume(formData);
      setUploadStep("Analysis complete!");

      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess(res.data);
        }
      }, 500);
    } catch (err) {
      setError(err.message || "Failed to upload and analyze resume.");
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card-header">
        <h3 className="card-title">
          <UploadCloud size={20} style={{ color: "var(--primary)" }} />
          <span>Upload & Analyze Resume</span>
        </h3>
        {onClose && (
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div
        className={`upload-dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          style={{ display: "none" }}
          accept=".pdf,.docx,.doc,.txt"
          disabled={uploading}
        />

        <div className="upload-icon">
          {uploading ? (
            <Loader2 className="spinner" size={32} style={{ color: "var(--primary)" }} />
          ) : (
            <FileText size={32} />
          )}
        </div>

        <h4 className="upload-title">
          {uploading ? uploadStep : file ? file.name : "Drag & Drop Resume (PDF or DOCX)"}
        </h4>

        <p className="upload-subtitle">
          {uploading
            ? "Performing deep structural text extraction & skill analysis..."
            : "Supports PDF and DOCX files up to 5MB"}
        </p>

        {file && !uploading && (
          <div className="upload-file-meta">
            <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)" }} />
            <span>
              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
        {onClose && (
          <button className="btn btn-secondary" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Analyzing..." : "Analyze with HireMind"}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;

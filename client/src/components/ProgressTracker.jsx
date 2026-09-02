import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressTracker = ({ progressHistory = [] }) => {
  const labels = progressHistory.length > 0 ? progressHistory.map((p) => p.date || p.label) : ["Iter #1", "Iter #2", "Iter #3"];
  const resumeScores = progressHistory.length > 0 ? progressHistory.map((p) => p.resumeScore) : [60, 72, 81];
  const readinessScores = progressHistory.length > 0 ? progressHistory.map((p) => p.placementReadiness) : [52, 68, 76];
  const jobMatchScores = progressHistory.length > 0 ? progressHistory.map((p) => p.jobMatchScore) : [64, 74, 84];

  const data = {
    labels,
    datasets: [
      {
        label: "Resume ATS Score",
        data: resumeScores,
        borderColor: "#6366f1", // Indigo
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.35,
        pointBackgroundColor: "#6366f1",
        pointRadius: 4,
      },
      {
        label: "Placement Readiness",
        data: readinessScores,
        borderColor: "#06b6d4", // Cyan
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        tension: 0.35,
        pointBackgroundColor: "#06b6d4",
        pointRadius: 4,
      },
      {
        label: "Job Match %",
        data: jobMatchScores,
        borderColor: "#10b981", // Emerald
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.35,
        pointBackgroundColor: "#10b981",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#94a3b8", font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#a5b4fc",
        borderColor: "#4f46e5",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8" },
      },
      x: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Placement & Skill Progression Over Time</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            Track how your Resume Score, Placement Readiness, and Job Match improve with each iteration.
          </p>
        </div>
      </div>
      <div style={{ height: "260px", position: "relative" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ProgressTracker;

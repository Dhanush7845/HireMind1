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
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyChart = ({ scoreHistory = [], skillDistribution = {} }) => {
  // 1. Line Chart Data (Score History Progression)
  const lineLabels = scoreHistory.length > 0 ? scoreHistory.map((s) => s.date || s.label) : ["Upload 1"];
  const lineScores = scoreHistory.length > 0 ? scoreHistory.map((s) => s.score) : [75];

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: "ATS Score Trend",
        data: lineScores,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointRadius: 5,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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

  // 2. Doughnut Chart Data (Skill Category Distribution)
  const distLabels = Object.keys(skillDistribution);
  const distValues = Object.values(skillDistribution);

  const doughnutData = {
    labels: distLabels.length > 0 ? distLabels : ["Languages", "Frameworks", "Databases", "Cloud"],
    datasets: [
      {
        data: distValues.length > 0 ? distValues : [4, 5, 3, 2],
        backgroundColor: [
          "#6366f1", // Indigo
          "#8b5cf6", // Purple
          "#06b6d4", // Cyan
          "#10b981", // Emerald
          "#f59e0b", // Amber
          "#f43f5e", // Rose
          "#3b82f6", // Blue
        ],
        borderColor: "#111827",
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#94a3b8", font: { size: 11 } },
      },
    },
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">ATS Score Progression</h3>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-emerald)" }}>Historical Trend</span>
        </div>
        <div style={{ height: "240px", position: "relative" }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Skill Arsenal Distribution</h3>
          <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>Category Breakdown</span>
        </div>
        <div style={{ height: "240px", position: "relative" }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;

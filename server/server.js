
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // (Postman, curl, mobile apps, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Currently permissive to avoid deployment/CORS issues.
      // We can restrict this after the frontend is deployed.
      return callback(null, true);
    },
    credentials: true,
  })
);

// --------------------------------------------------
// Body Parsers
// --------------------------------------------------

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// --------------------------------------------------
// Static Files
// --------------------------------------------------

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    service: "HireMind API Platform",
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found on this server.`,
  });
});

// --------------------------------------------------
// Error Handler
// --------------------------------------------------

app.use(errorHandler);

// --------------------------------------------------
// Local Development Server
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("====================================================");
    console.log(
      `🚀 HireMind Server running in ${process.env.NODE_ENV || "development"
      } mode on http://localhost:${PORT}`
    );
    console.log(
      `📡 Health Check: http://localhost:${PORT}/api/health`
    );
    console.log("====================================================");
  });
}

// Export Express app for Vercel
export default app;

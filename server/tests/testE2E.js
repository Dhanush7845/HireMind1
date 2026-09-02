import fs from "fs";
import path from "path";
import http from "http";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import JobMatch from "../models/JobMatch.js";

const PORT = 5000;
let testToken = "";
let testUserId = "";
let testResumeId = "";
let testAnalysisId = "";

const request = async ({ method, path, headers = {}, body = null }) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
      path,
      method,
      headers: {
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      if (typeof body === "string" || Buffer.isBuffer(body)) {
        req.write(body);
      } else {
        req.setHeader("Content-Type", "application/json");
        req.write(JSON.stringify(body));
      }
    }

    req.end();
  });
};

const sendMultipartUpload = async ({ filePath, token }) => {
  return new Promise((resolve, reject) => {
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    let header = `--${boundary}\r\n`;
    header += `Content-Disposition: form-data; name="resume"; filename="${fileName}"\r\n`;
    header += `Content-Type: text/plain\r\n\r\n`;

    const footer = `\r\n--${boundary}--\r\n`;

    const body = Buffer.concat([
      Buffer.from(header, "utf-8"),
      fileContent,
      Buffer.from(footer, "utf-8"),
    ]);

    const req = http.request(
      {
        hostname: "localhost",
        port: PORT,
        path: "/api/resumes/upload",
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

async function runE2ETests() {
  console.log("\n=======================================================");
  console.log("?? RUNNING HIREMIND FULL END-TO-END API INTEGRATION TEST");
  console.log("=======================================================\n");

  // Wait 1.5s for server & DB connection to initialize
  await new Promise((r) => setTimeout(r, 1500));

  try {
    const testEmail = "test.candidate@hiremind.dev";
    await User.deleteOne({ email: testEmail });

    // 1. Health check
    console.log("?? 1. Testing API Health Endpoint (/api/health)...");
    const health = await request({ method: "GET", path: "/api/health" });
    console.log("     Status:", health.status, "Success:", health.data?.success);
    if (health.status !== 200) throw new Error("Health check failed");

    // 2. Register User
    console.log("\n?? 2. Testing Registration (POST /api/auth/register)...");
    const regRes = await request({
      method: "POST",
      path: "/api/auth/register",
      body: {
        name: "Alex Morgan",
        email: testEmail,
        password: "HireMindPassword2026!",
      },
    });
    console.log("     Status:", regRes.status, "Message:", regRes.data?.message);
    if (regRes.status !== 201 || !regRes.data?.data?.token) {
      throw new Error("Registration failed: " + JSON.stringify(regRes.data));
    }
    testToken = regRes.data.data.token;
    testUserId = regRes.data.data.user.id;

    // 3. Login User
    console.log("\n?? 3. Testing Login (POST /api/auth/login)...");
    const loginRes = await request({
      method: "POST",
      path: "/api/auth/login",
      body: {
        email: testEmail,
        password: "HireMindPassword2026!",
      },
    });
    console.log("     Status:", loginRes.status, "Token acquired:", Boolean(loginRes.data?.data?.token));
    if (loginRes.status !== 200) throw new Error("Login failed");

    // 4. Get Current User Info
    console.log("\n?? 4. Testing Authenticated Current User (/api/auth/me)...");
    const meRes = await request({
      method: "GET",
      path: "/api/auth/me",
      headers: { Authorization: `Bearer ${testToken}` },
    });
    console.log("     Status:", meRes.status, "User Name:", meRes.data?.data?.user?.name);
    if (meRes.status !== 200) throw new Error("Me endpoint failed");

    // 5. Upload Resume
    console.log("\n?? 5. Testing Resume Ingestion & ATS Engine (POST /api/resumes/upload)...");
    const samplePath = path.join(process.cwd(), "tests/sample_resume.txt");
    const uploadRes = await sendMultipartUpload({ filePath: samplePath, token: testToken });
    console.log("     Status:", uploadRes.status, "Score:", uploadRes.data?.data?.analysis?.score);
    console.log("     Skills Extracted:", uploadRes.data?.data?.analysis?.skills?.length);
    console.log("     Grade:", uploadRes.data?.data?.analysis?.grade);
    if (uploadRes.status !== 201) throw new Error("Resume upload failed: " + JSON.stringify(uploadRes.data));

    testResumeId = uploadRes.data.data.resume.id;
    testAnalysisId = uploadRes.data.data.analysis.id;

    // 6. Get Resumes
    console.log("\n?? 6. Testing List Resumes (GET /api/resumes)...");
    const resumesList = await request({
      method: "GET",
      path: "/api/resumes",
      headers: { Authorization: `Bearer ${testToken}` },
    });
    console.log("     Status:", resumesList.status, "Count:", resumesList.data?.count);
    if (resumesList.status !== 200 || resumesList.data?.count < 1) throw new Error("Get resumes failed");

    // 7. Get Analysis By ID
    console.log("\n?? 7. Testing Get Analysis Detail (GET /api/analysis/:id)...");
    const analysisDetail = await request({
      method: "GET",
      path: `/api/analysis/${testAnalysisId}`,
      headers: { Authorization: `Bearer ${testToken}` },
    });
    console.log("     Status:", analysisDetail.status, "Candidate:", analysisDetail.data?.data?.extractedInfo?.personalInfo?.name);
    if (analysisDetail.status !== 200) throw new Error("Get analysis failed");

    // 8. Get Dashboard Aggregated Stats
    console.log("\n?? 8. Testing Dashboard Stats (GET /api/analysis/dashboard/stats)...");
    const dashStats = await request({
      method: "GET",
      path: "/api/analysis/dashboard/stats",
      headers: { Authorization: `Bearer ${testToken}` },
    });
    console.log("     Status:", dashStats.status, "Latest ATS Score:", dashStats.data?.data?.latestScore);
    console.log("     Score History Length:", dashStats.data?.data?.scoreHistory?.length);
    if (dashStats.status !== 200) throw new Error("Dashboard stats failed");

    // 9. Match Against Job Description
    console.log("\n?? 9. Testing Job Match & Skill Gap Engine (POST /api/jobs/analyze)...");
    const jobDesc = `
    Senior Full Stack Engineer (MERN)
    Looking for a Full Stack Software Developer with strong proficiency in React, Node.js, Express.js, TypeScript, MongoDB, and AWS.
    Experience with Docker, Kubernetes, and CI/CD pipelines required.
    Bonus skills: GraphQL, Next.js, and Redis.
    `;

    const jobMatchRes = await request({
      method: "POST",
      path: "/api/jobs/analyze",
      headers: { Authorization: `Bearer ${testToken}` },
      body: {
        jobTitle: "Senior Full Stack Engineer",
        company: "Enterprise Cloud Inc",
        jobDescription: jobDesc,
        resumeId: testResumeId,
      },
    });

    console.log("     Status:", jobMatchRes.status, "Match Score:", jobMatchRes.data?.data?.matchScore + "%");
    console.log("     Matched Skills:", jobMatchRes.data?.data?.matchedSkills);
    console.log("     Missing Skills:", jobMatchRes.data?.data?.missingSkills);
    if (jobMatchRes.status !== 201 || jobMatchRes.data?.data?.matchScore < 70) throw new Error("Job matching failed");

    // 10. Update Profile
    console.log("\n?? 10. Testing Profile Update (PUT /api/users/profile)...");
    const profileUpdate = await request({
      method: "PUT",
      path: "/api/users/profile",
      headers: { Authorization: `Bearer ${testToken}` },
      body: {
        targetRoles: ["Lead Full Stack Engineer", "Senior SDE"],
        bio: "Updated executive candidate bio for campus placement 2026.",
      },
    });
    console.log("     Status:", profileUpdate.status, "Roles:", profileUpdate.data?.data?.user?.targetRoles);
    if (profileUpdate.status !== 200) throw new Error("Profile update failed");

    console.log("\n=======================================================");
    console.log("?? ALL END-TO-END INTEGRATION TESTS PASSED PERFECTLY!");
    console.log("=======================================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("\n? E2E Test Suite Error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runE2ETests();

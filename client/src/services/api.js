import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hiremind_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors & 401 token expiry
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred. Please try again.";

    if (error.response?.status === 401) {
      // Clear token on authorization failure if not on auth pages
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register") &&
        window.location.pathname !== "/"
      ) {
        localStorage.removeItem("hiremind_token");
        localStorage.removeItem("hiremind_user");
        window.location.href = "/login?expired=true";
      }
    }

    return Promise.reject(new Error(message));
  }
);

// ----------------------------------------------------
// Authentication API
// ----------------------------------------------------
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// ----------------------------------------------------
// Resume API
// ----------------------------------------------------
export const resumeAPI = {
  uploadResume: (formData, onUploadProgress) =>
    api.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
  getResumes: () => api.get("/resumes"),
  getResumeById: (id) => api.get(`/resumes/${id}`),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
};

// ----------------------------------------------------
// Analysis API
// ----------------------------------------------------
export const analysisAPI = {
  getAnalyses: () => api.get("/analysis"),
  getAnalysisById: (id) => api.get(`/analysis/${id}`),
  getDashboardStats: () => api.get("/analysis/dashboard/stats"),
};

// ----------------------------------------------------
// Job Matching API
// ----------------------------------------------------
export const jobAPI = {
  analyzeJob: (payload) => api.post("/jobs/analyze", payload),
  getJobHistory: () => api.get("/jobs/history"),
  getJobMatchById: (id) => api.get(`/jobs/${id}`),
  deleteJobMatch: (id) => api.delete(`/jobs/${id}`),
};

// ----------------------------------------------------
// User Profile API
// ----------------------------------------------------
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
};

export default api;

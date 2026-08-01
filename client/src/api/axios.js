import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const API_ROOT = API_BASE_URL?.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_ROOT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

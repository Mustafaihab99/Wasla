import axios from "axios";

const isLocal = window.location.hostname === "localhost";

const axiosInstance = axios.create({
  baseURL: isLocal
    ? "http://wasla1.runasp.net/api/"
    : "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token and language before each request
axiosInstance.interceptors.request.use(
  (config) => {
    // read token
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // read current language from localStorage every time
    const lang = localStorage.getItem("applang") || "en";
    // if your API uses it as query param, we add it automatically
    if (config.url && !config.url.includes("lan=")) {
      const separator = config.url.includes("?") ? "&" : "?";
      config.url += `${separator}lan=${lang}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, redirecting to login...");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";
import i18n from "../i18n";

const isLocal = window.location.hostname === "localhost";

const axiosInstance = axios.create({
  baseURL: isLocal
    ? "http://wasla1.runasp.net/api/"
    : "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

i18n.on("languageChanged", (lng) => {
  axiosInstance.defaults.headers["Accept-Language"] = lng;
});
// Add token and language before each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const lang = i18n.language || "en";
    config.headers["Accept-Language"] = lang;

    // add query param
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

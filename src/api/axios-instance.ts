import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import i18n from "../i18n";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API as string,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

i18n.on("languageChanged", (lng: string) => {
  axiosInstance.defaults.headers.common["Accept-Language"] = lng;
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const lang = i18n.language || "en";
    config.headers["Accept-Language"] = lang;

      const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url && !config.url.includes("lan=")) {
      const separator = config.url.includes("?") ? "&" : "?";
      config.url += `${separator}lan=${lang}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: (() => void)[] = [];

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<void>((resolve) => {
          failedQueue.push(resolve);
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API}/Account/refresh-token`,
          {},
          { withCredentials: true }
        );

        failedQueue.forEach((cb) => cb());
        failedQueue = [];

        return axiosInstance(originalRequest);
      } catch (err) {
        failedQueue = [];
        window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import i18n from "../i18n";
import { jwtDecode, JwtPayload } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API as string,
  headers: {
    "Content-Type": "application/json",
  },
});

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

i18n.on("languageChanged", (lng: string) => {
  axiosInstance.defaults.headers.common["Accept-Language"] = lng;
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("auth_token");

    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp - currentTime < 60) {
        try {
          await refreshAccessToken();
        } catch {
          sessionStorage.clear();
          window.location.href = "/auth/login";
        }
      }

      config.headers.Authorization =
        `Bearer ${sessionStorage.getItem("auth_token")}`;
    }

    const lang = i18n.language || "en";
    config.headers["Accept-Language"] = lang;

    if (config.url && !config.url.includes("lan=")) {
      const separator = config.url.includes("?") ? "&" : "?";
      config.url += `${separator}lan=${lang}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);

      } catch (err) {
        processQueue(err, null);
        sessionStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// refresh
async function refreshAccessToken(): Promise<string> {
  const refreshToken = sessionStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post<{ data: { token: string } }>(
    `${import.meta.env.VITE_API}/Account/refresh-token`,
    { refreshToken }
  );

  const newAccessToken = res.data.data.token;
  sessionStorage.setItem("auth_token", newAccessToken);

  axiosInstance.defaults.headers.common.Authorization =
    `Bearer ${newAccessToken}`;

  return newAccessToken;
}

export default axiosInstance;

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { clearAuthStorage, getAccessToken, getRefreshToken, setTokens } from "@/lib/auth-storage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

export const axiosMultipart = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

const forceLogout = () => {
  clearAuthStorage();
  if (window.location.pathname !== "/login") window.location.assign("/login");
};

function attachAuthInterceptors(client: typeof axiosInstance) {
  client.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      console.log("Co token: ", token);
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      if (!error.response) return Promise.reject(error);

      const status = error.response.status;
      const original = error.config as AxiosRequestConfig & { _retry?: boolean };
      const url = String(original?.url ?? "");

      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

      // 1) Không xử lý refresh cho chính login/refresh
      if (isAuthEndpoint) return Promise.reject(error);

      // 2) Chỉ xử lý 401, và chỉ retry 1 lần
      if (status !== 401 || original._retry) return Promise.reject(error);

      const refreshToken = getRefreshToken();
      console.log("Refresh token khi 401:", refreshToken);

      if (!refreshToken) {
        console.log("Refresh token khong ton tai");
        forceLogout();
        return Promise.reject(error);
      }

      // 3) Nếu đang refresh => chờ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            if (!token) return reject(error);
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${token}`;
            resolve(client(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const rr = await refreshClient.post(
          "/auth/refresh",
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );
        const { accessToken, refreshToken: newRefresh } = rr.data.data as {
          accessToken: string;
          refreshToken: string;
        };
        console.log("Vua refresh token, co accessToken va newRefresh: ", accessToken, newRefresh);

        setTokens(accessToken, newRefresh);
        flushQueue(accessToken);

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${accessToken}`;
        return client(original);
      } catch (refreshErr) {
        flushQueue(null);
        forceLogout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    },
  );
}

attachAuthInterceptors(axiosInstance);
attachAuthInterceptors(axiosMultipart);

export default axiosInstance;

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { clearAuthStorage, getAccessToken, setAccessToken } from "@/lib/auth-storage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const axiosMultipart = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  withCredentials: true,

});

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

const forceLogout = async () => {
  clearAuthStorage();
  if (window.location.pathname !== "/login") window.location.assign("/login");
};

function attachAuthInterceptors(client: typeof axiosInstance) {
  client.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      (config.headers as any) = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
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

      if (url.includes("/auth/")) return Promise.reject(error);

      // Không xử lý refresh cho TH nay
      if (status !== 401 || original._retry) return Promise.reject(error);

      if (isRefreshing) {
        console.log("Dang refresh token");
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            if (!token) return reject(error);
            (original.headers as any) = original.headers ?? {};
            (original.headers as any).Authorization = `Bearer ${token}`;
            resolve(client(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const rr = await refreshClient.post(
          "/auth/refresh"
        );
        const accessToken = rr.data?.accessToken ?? rr.data?.data?.accessToken as string | undefined;
        if (!accessToken) throw new Error("No accessToken in refresh response");

        setAccessToken(accessToken);
        flushQueue(accessToken);

        (original.headers as any) = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${accessToken}`;
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

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { clearAuthStorage, getAccessToken, getRefreshToken, setTokens } from "@/lib/auth-storage";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const axiosMultipart = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 50000,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const resolveRefreshQueue = (token: string | null) => {
  refreshQueue.forEach((callback) => callback(token));
  refreshQueue = [];
};

function attachAuthInterceptors(client: ReturnType<typeof axios.create>) {
  client.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (!error.response) return Promise.reject(error);

      const status = error.response.status;
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      const requestUrl = originalRequest?.url || "";
      const isAuthRequest =
        requestUrl.includes("/auth/login") || requestUrl.includes("/auth/refresh");

      if (status === 401 && !originalRequest?._retry && !isAuthRequest) {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearAuthStorage();
          window.location.assign("/login");
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push((token) => {
              if (!token) return reject(error);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }

              // ✅ retry bằng chính client (json hay multipart đều đúng)
              resolve(client(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await refreshClient.post(
            "/auth/refresh",
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } },
          );

          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data as {
            accessToken: string;
            refreshToken: string;
          };

          setTokens(accessToken, newRefreshToken);
          resolveRefreshQueue(accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return client(originalRequest);
        } catch (refreshError) {
          resolveRefreshQueue(null);
          clearAuthStorage();
          window.location.assign("/login");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) alert("Bạn không có quyền truy cập chức năng này");
      return Promise.reject(error);
    },
  );
}
attachAuthInterceptors(axiosInstance);
attachAuthInterceptors(axiosMultipart);

export default axiosInstance;

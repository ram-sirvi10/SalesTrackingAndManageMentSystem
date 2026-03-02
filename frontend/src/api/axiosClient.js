import axios from "axios";
import env from "../config/env";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../utils/token.util";

const axiosClient = axios.create({
  baseURL: env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//  Attach access token
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Auto refresh on 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response, reject
    if (!error.response) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;
    const isRefreshCall = originalRequest.url.includes("/auth/refresh-token");

    if (isUnauthorized && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        const res = await axiosClient.post("/auth/refresh-token");

        const newAccessToken = res.data?.data?.accessToken;

        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;

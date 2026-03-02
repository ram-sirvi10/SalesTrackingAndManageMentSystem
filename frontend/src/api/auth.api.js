import axiosClient from "./axiosClient";

export const loginApi = (data) => axiosClient.post("/auth/login", data);

export const forgotPasswordApi = (data) =>
  axiosClient.patch("/auth/forgot-password", data);

export const verifyOtpApi = (data) =>
  axiosClient.post("/auth/verify-otp", data);

export const resetPasswordApi = (data) =>
  axiosClient.patch("/auth/reset-password", data);

export const logoutApi = () => axiosClient.post("/auth/logout");

export const createUserApi = (data) => axiosClient.post("/auth/adduser", data);

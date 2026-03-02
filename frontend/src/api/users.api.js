import axiosClient from "./axiosClient";

export const getCurrentUserApi = () => axiosClient.get("/users/me");
export const getAllUsersAPi = () => axiosClient.get("/users");
export const getUsersByRole = (id) => axiosClient.get(`/users/role/${id}`);
export const getPendingUsersAPi = () => axiosClient.get("/users/pending");
export const getUserByIdApi = (id) => axiosClient.get(`/users/${id}`);
export const updateAPi = (id, data) => axiosClient.patch(`/users/${id}`, data);

export const approveApi = (id) => axiosClient.patch(`/users/approve/${id}`);
export const rejectApi = (id) => axiosClient.patch(`/users/reject/${id}`);

export const toggleStatusApi = (id) =>
  axiosClient.patch(`/users/toggle-status/${id}`);

export const deleteUserApi = (id) => axiosClient.delete(`/users/${id}`);

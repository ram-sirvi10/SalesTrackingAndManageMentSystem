import axiosClient from "./axiosClient";

export const getCurrentUserApi = () => axiosClient.get("/users/me");
export const getAllUsersAPi = (pageNo = 0, pageSize = 10, search = "") =>
  axiosClient.get(
    `/users?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
  );
export const getUsersByRole = (id, pageNo = 0, pageSize = 10) =>
  axiosClient.get(`/users/role/${id}?pageNo=${pageNo}&pageSize=${pageSize}`);
export const getPendingUsersAPi = (pageNo = 0, pageSize = 10) =>
  axiosClient.get(`/users/pending?pageNo=${pageNo}&pageSize=${pageSize}`);
export const getUserByIdApi = (id) => axiosClient.get(`/users/${id}`);
export const updateAPi = (id, data) => axiosClient.patch(`/users/${id}`, data);

export const approveApi = (id) => axiosClient.patch(`/users/approve/${id}`);
export const rejectApi = (id) => axiosClient.patch(`/users/reject/${id}`);

export const toggleStatusApi = (id) =>
  axiosClient.patch(`/users/toggle-status/${id}`);

export const deleteUserApi = (id) => axiosClient.delete(`/users/${id}`);

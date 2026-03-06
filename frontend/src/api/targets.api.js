import axiosClient from "./axiosClient";

export const createTargetApi = (data) =>
  axiosClient.post("/targets", data);

export const updateTargetApi = (id, data) =>
  axiosClient.put(`/targets/${id}`, data);

export const deleteTargetApi = (id) =>
  axiosClient.delete(`/targets/${id}`);

export const getTargetByIdApi = (id) =>
  axiosClient.get(`/targets/${id}`);

export const getAllTargetsApi = (page = 0, size = 10) =>
  axiosClient.get("/targets", {
    params: { pageNo: page, pageSize: size },
  });

export const getTargetsByUserApi = (userId, page = 0, size = 10) =>
  axiosClient.get(`/targets/user/${userId}`, {
    params: { pageNo: page, pageSize: size },
  });

export const getTeamPerformanceApi = (month, year) =>
  axiosClient.get("/targets/performance/team", {
    params: { month, year },
  });

export const getUserPerformanceApi = (userId, month, year) =>
  axiosClient.get(`/targets/performance/user/${userId}`, {
    params: { month, year },
  });
import axiosClient from "./axiosClient";

export const createLeadApi = (data) => axiosClient.post("/leads", data);
export const updateLeadApi = (id, data) =>
  axiosClient.put(`/leads/${id}`, data);
export const assignLeadApi = (data) => axiosClient.patch(`/leads/assign`, data);

export const updateLeadStatusApi = (data) =>
  axiosClient.patch(`/leads/status`, data);
export const deleteLeadApi = (id) => axiosClient.delete(`/leads/${id}`);

export const getAllApi = () => axiosClient.get("/leads");
export const getAssignedLeadByUserApi = (id) =>
  axiosClient.get(`/leads/assigned/${id}`);
export const getLeadByIdApi = (id) => axiosClient.get(`/leads/${id}`);

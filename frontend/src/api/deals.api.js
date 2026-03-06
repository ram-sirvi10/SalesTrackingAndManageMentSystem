import axiosClient from "./axiosClient";

export const createDealApi = (data) => axiosClient.post("/deals", data);
export const updateDealApi = (id, data) =>
  axiosClient.put(`/deals/${id}`, data);
export const assignDealApi = (data) => axiosClient.patch(`/deals/assign`, data);

export const updateDealStatusApi = (data) =>
  axiosClient.patch(`/deals/stage`, data);
export const deleteDealApi = (id) => axiosClient.delete(`/deals/${id}`);

export const getAllApi = (pageNo = 0, pageSize = 10) => 
  axiosClient.get(`/deals?pageNo=${pageNo}&pageSize=${pageSize}`);
export const getAssignedDealByUserApi = (id, pageNo = 0, pageSize = 10) =>
  axiosClient.get(`/deals/assigned/${id}?pageNo=${pageNo}&pageSize=${pageSize}`);
export const getDealByIdApi = (id) => axiosClient.get(`/deals/${id}`);

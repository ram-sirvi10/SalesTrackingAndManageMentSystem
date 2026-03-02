import axiosClient from "./axiosClient";

export const createDealApi = (data) => axiosClient.post("/deals", data);
export const updateDealApi = (id, data) =>
  axiosClient.put(`/deals/${id}`, data);
export const assignDealApi = (data) => axiosClient.patch(`/deals/assign`, data);

export const updateDealStatusApi = (data) =>
  axiosClient.patch(`/deals/stage`, data);
export const deleteDealApi = (id) => axiosClient.delete(`/deals/${id}`);

export const getAllApi = () => axiosClient.get("/deals");
export const getAssignedDealByUserApi = (id) =>
  axiosClient.get(`/deals/assigned/${id}`);
export const getDealByIdApi = (id) => axiosClient.get(`/deals/${id}`);

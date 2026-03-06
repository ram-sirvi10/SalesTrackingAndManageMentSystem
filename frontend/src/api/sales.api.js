import axiosClient from "./axiosClient";

export const createSaleApi = (data) => axiosClient.post("/sales", data);
export const updatePaymentStatusApi = (data) =>
  axiosClient.patch("/sales/payment-status", data);
export const getSaleByIdApi = (id) => axiosClient.get(`/sales/${id}`);
export const getAllApi = (pageNo = 0, pageSize = 10) =>
  axiosClient.get(`/sales?pageNo=${pageNo}&pageSize=${pageSize}`);
export const getSalesByCommissionUserApi = (
  userId,
  pageNo = 0,
  pageSize = 10,
) =>
  axiosClient.get(
    `/sales/commission/${userId}?pageNo=${pageNo}&pageSize=${pageSize}`,
  );

export const getMonthlySummaryApi = (year) =>
  axiosClient.get(`/sales/summary/monthly?year=${year}`);

export const getYearlySummaryApi = () =>
  axiosClient.get(`/sales/summary/yearly`);

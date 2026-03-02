import axiosClient from "./axiosClient";

export const getDashboardReport = (startDate, endDate) =>
  axiosClient.get("/api/reports/dashboard", {
    params: { startDate, endDate },
  });

export const getSalesByUser = (startDate, endDate) =>
  axiosClient.get("/api/reports/sales-by-user", {
    params: { startDate, endDate },
  });

export const getSalesByPeriod = (startDate, endDate) =>
  axiosClient.get("/api/reports/sales-by-period", {
    params: { startDate, endDate },
  });

export const getConversionReport = (startDate, endDate) =>
  axiosClient.get("/api/reports/conversion", {
    params: { startDate, endDate },
  });

export const getLostDealReport = (startDate, endDate) =>
  axiosClient.get("/api/reports/lost-deals", {
    params: { startDate, endDate },
  });

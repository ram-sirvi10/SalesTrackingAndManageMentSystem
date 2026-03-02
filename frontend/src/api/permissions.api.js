import axiosClient from "./axiosClient";

export const getPermissions = () => axiosClient.get("/permissions");
export const getPermssionByRole = (id) =>
  axiosClient.get(`/permissions/roles/${id}`);
export const getPermssionByUser = (id) =>
  axiosClient.get(`/permissions/users/${id}`);

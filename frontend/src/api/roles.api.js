import axiosClient from "./axiosClient";

export const createRole = (data) =>
  axiosClient.post("/roles/create-role", data);

export const updateRole = (id, data) => axiosClient.put(`/roles/${id}`, data);

export const deleteRole = (id) => axiosClient.delete(`/roles/${id}`);

export const getRoleById = (id) => axiosClient.get(`/roles/${id}`);
export const getRoles = () => axiosClient.get("/roles");
export const getRolesByUserId = (id) => axiosClient.get(`/roles/user/${id}`);
export const addPermissionToRole = (roleId, permissionId) =>
  axiosClient.patch(`/roles/${roleId}/permissions/${permissionId}`);

export const removePermissionToRole = (roleId, permissionId) =>
  axiosClient.delete(`/roles/${roleId}/permissions/${permissionId}`);

export const addPermissionsToRole = (roleId, permissions) =>
  axiosClient.patch(`/roles/${roleId}/permissions`, {
    permissions,
  });

export const assignRoleApi = (data) =>
  axiosClient.patch(`/roles/assign-role`, data);
export const removeRoleApi = (data) =>
  axiosClient.delete(`/roles/remove-role`, {
    data,
  });

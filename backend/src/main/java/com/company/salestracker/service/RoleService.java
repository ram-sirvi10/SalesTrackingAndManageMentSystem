package com.company.salestracker.service;

import java.util.List;
import java.util.Set;

import com.company.salestracker.dto.request.AssignRolesRequest;
import com.company.salestracker.dto.request.RoleRequest;
import com.company.salestracker.dto.response.RoleResponse;

public interface RoleService {

	RoleResponse createRole(RoleRequest request);

	List<RoleResponse> viewAllDefaultRole();

	List<RoleResponse> getAllRolesByAdmin(String adminId);

	Boolean assignRolesToUser(AssignRolesRequest request);

	void addPermissionToRole(String roleId, String permissionId);

	void removePermissionFromRole(String roleId, String permissionId);

	Boolean removeRoleFromUser(String userId, String roleId);

	Boolean deleteRole(String roleId);

	RoleResponse updateRole(String roleId, RoleRequest request);

	RoleResponse getRoleById(String roleId);

	List<RoleResponse> getRolesByUser(String userId);

	void addPermissionsToRole(String roleId, Set<String> list);

}

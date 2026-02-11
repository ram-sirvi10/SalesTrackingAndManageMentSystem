package com.company.salestracker.service;

import java.util.List;

import com.company.salestracker.dto.request.AssignRolesRequest;
import com.company.salestracker.dto.request.CreateRoleRequest;
import com.company.salestracker.dto.response.RoleResponse;

public interface RoleService {

	RoleResponse createRole(CreateRoleRequest request);

	List<RoleResponse> viewAllDefaultRole();

	List<RoleResponse> allRoleByAdmin(String adminId);

	Boolean assignRolesToUser(AssignRolesRequest request);

}

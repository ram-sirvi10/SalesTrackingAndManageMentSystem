package com.company.salestracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.AssignRolesRequest;
import com.company.salestracker.dto.request.RoleRequest;
import com.company.salestracker.dto.request.UpdateRolePermissionRequest;
import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.dto.response.RoleResponse;
import com.company.salestracker.service.RoleService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@AllArgsConstructor
public class RoleController {

	private final RoleService roleService;

	// CREATE ROLE
	@PostMapping("/create-role")
	@PreAuthorize("hasAuthority('CREATE_ROLE')")
	public ResponseEntity<ApiResponse<RoleResponse>> registerUser(@Valid @RequestBody RoleRequest roleRequest) {

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Role Created Successfully", roleService.createRole(roleRequest)));
	}

	// GET ADMIN ROLES
	@GetMapping("/get-admin-roles")
	@PreAuthorize("hasAuthority('GET_ROLES_BY_ADMIN')")
	public ResponseEntity<ApiResponse<List<RoleResponse>>> getRolesByAdmin(@RequestParam String adminId) {

		return ResponseEntity
				.ok(ApiResponse.success("Roles fetched successfully", roleService.getAllRolesByAdmin(adminId)));
	}

	// GET DEFAULT ROLES
	@GetMapping("/get-default-roles")
	@PreAuthorize("hasAuthority('VIEW_DEFAULT_ROLE')")
	public ResponseEntity<ApiResponse<List<RoleResponse>>> getDefaultRoles() {

		return ResponseEntity.ok(ApiResponse.success("Default roles fetched", roleService.viewAllDefaultRole()));
	}

	// ADD SINGLE PERMISSION
	@PostMapping("/{roleId}/permissions/{permissionId}")
	@PreAuthorize("hasAuthority('ADD_PERMISSION_TO_ROLE')")
	public ResponseEntity<ApiResponse<?>> addPermission(@PathVariable String roleId,
			@PathVariable String permissionId) {
		roleService.addPermissionToRole(roleId, permissionId);
		return ResponseEntity.ok(ApiResponse.success("Permission added Successfully"));
	}

	// ADD BULK PERMISSIONS
	@PostMapping("/{roleId}/permissions")
	@PreAuthorize("hasAuthority('ADD_PERMISSION_TO_ROLE')")
	public ResponseEntity<ApiResponse<?>> addPermissionsToRole(@PathVariable String roleId,
			@Valid	@RequestBody UpdateRolePermissionRequest request) {

		roleService.addPermissionsToRole(roleId, request.getPermissions());
		return ResponseEntity.ok(ApiResponse.success("Permissions added Successfully"));
	}

	// REMOVE PERMISSION
	@DeleteMapping("/{roleId}/permissions/{permissionId}")
	@PreAuthorize("hasAuthority('REMOVE_PERMISSION_FROM_ROLE')")
	public ResponseEntity<ApiResponse<?>> removePermission(@PathVariable String roleId,
			@PathVariable String permissionId) {

		roleService.removePermissionFromRole(roleId, permissionId);
		return ResponseEntity.ok(ApiResponse.success("Permission removed Successfully"));
	}

	// UPDATE ROLE
	@PutMapping("/{roleId}")
	@PreAuthorize("hasAuthority('UPDATE_ROLE')")
	public ResponseEntity<ApiResponse<RoleResponse>> updateRole(@PathVariable String roleId,
			@Valid	@RequestBody RoleRequest request) {

		return ResponseEntity
				.ok(ApiResponse.success("Role updated successfully", roleService.updateRole(roleId, request)));
	}

	// GET ROLE BY ID
	@GetMapping("/{roleId}")
	@PreAuthorize("hasAuthority('VIEW_ROLE')")
	public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(@PathVariable String roleId) {

		return ResponseEntity.ok(ApiResponse.success("Role fetched successfully", roleService.getRoleById(roleId)));
	}

	
	// GET  ROLE 
		@GetMapping("/user/{userId}")
		@PreAuthorize("hasAuthority('VIEW_USER_ROLES')")
		public ResponseEntity<ApiResponse<List<RoleResponse>>> getUserRoles(@PathVariable String userId) {

			return ResponseEntity.ok(ApiResponse.success("User roles fetched", roleService.getRolesByUser(userId)));
		}

	// ASSIGN ROLE TO USER
	@PostMapping("/assign-role")
	@PreAuthorize("hasAuthority('ASSIGN_ROLE')")
	public ResponseEntity<ApiResponse<?>> assignRoleToUser (@Valid @RequestBody AssignRolesRequest request) {

		roleService.assignRolesToUser(request);
		return ResponseEntity.ok(ApiResponse.success("Roles assigned successfully"));
	}

	// REMOVE ROLE FROM USER
	@DeleteMapping("/remove-role")
	@PreAuthorize("hasAuthority('REMOVE_ROLE_FROM_USER')")
	public ResponseEntity<ApiResponse<?>> removeRoleFromUser(@RequestParam String userId, @RequestParam String roleId) {

		roleService.removeRoleFromUser(userId, roleId);
		return ResponseEntity.ok(ApiResponse.success("Role removed successfully"));
	}

	// DELETE ROLE
	@DeleteMapping("/{roleId}")
	@PreAuthorize("hasAuthority('DELETE_ROLE')")
	public ResponseEntity<ApiResponse<?>> deleteRole(@PathVariable String roleId) {

		roleService.deleteRole(roleId);
		return ResponseEntity.ok(ApiResponse.success("Role deleted successfully"));
	}
	
	
	
}

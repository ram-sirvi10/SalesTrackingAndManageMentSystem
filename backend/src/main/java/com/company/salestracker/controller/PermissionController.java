package com.company.salestracker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.service.PermissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

	private final PermissionService permissionService;

	// ==============================
	// VIEW ALL PERMISSION
	// ==============================
	@GetMapping
	@PreAuthorize("hasAuthority('VIEW_ALL_PERMISSIONS')")
	public ResponseEntity<ApiResponse<List<?>>> viewAllPermisisons() {

		return ResponseEntity
				.ok(ApiResponse.success("Leads fetched successfully", permissionService.getAllPermission()));
	}

	// ==============================
	// VIEW ALL PERMISSION BY ROLE
	// ==============================
	@GetMapping("/{roleId}")
	@PreAuthorize("hasAuthority('VIEW_ALL_PERMISSIONS_BY_ROLE')")
	public ResponseEntity<ApiResponse<List<?>>> viewAllPermissionsByRole(@PathVariable String roleId) {

		return ResponseEntity.ok(
				ApiResponse.success("Leads fetched successfully", permissionService.getAllPermissionByRole(roleId)));
	}

	// ==============================
	// VIEW ALL PERMISSION BY USER
	// ==============================
	@GetMapping("/{userId}")
	@PreAuthorize("hasAuthority('VIEW_ALL_PERMISSIONS_BY_USER')")
	public ResponseEntity<ApiResponse<List<?>>> viewAllPermissionsByUser(@PathVariable String userId) {

		return ResponseEntity.ok(
				ApiResponse.success("Leads fetched successfully", permissionService.getAllPermissionByUser(userId)));
	}

}

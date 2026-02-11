package com.company.salestracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.CreateRoleRequest;
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

	@PostMapping("/create-role")
	public ResponseEntity<ApiResponse<RoleResponse>> registerUser(@Valid @RequestBody CreateRoleRequest roleRequest) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Role Created SuccessFull", roleService.createRole(roleRequest)));
	}

	@GetMapping("/get-admin-roles")
	public ResponseEntity<ApiResponse<List<RoleResponse>>> getRolesByAdmin(@RequestParam String adminId) {
		return ResponseEntity.status(HttpStatus.OK)
				.body(ApiResponse.success("User Login SuccessFull", roleService.allRoleByAdmin(adminId)));
	}

	@GetMapping("/get-default-roles")
	public ResponseEntity<ApiResponse<List<RoleResponse>>> getDefaultRoles() {
		return ResponseEntity.status(HttpStatus.OK)
				.body(ApiResponse.success("User Login SuccessFull", roleService.viewAllDefaultRole()));
	}

}

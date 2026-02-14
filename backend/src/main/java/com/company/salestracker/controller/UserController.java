package com.company.salestracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.UpdateUserRequest;
import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.UserResponse;
import com.company.salestracker.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

	private final UserService userService;

	// ==============================
	// UPDATE USER
	// ==============================
	@PatchMapping("/{userId}")
	@PreAuthorize("hasAuthority('UPDATE_USER')")
	public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable String userId,
			@Valid @RequestBody UpdateUserRequest request) {

		return ResponseEntity
				.ok(ApiResponse.success("User updated successfully", userService.updateUser(userId, request)));
	}

	// ==============================
	// DELETE USER (Soft Delete)
	// ==============================
	@DeleteMapping("/{userId}")
	@PreAuthorize("hasAuthority('DELETE_USER')")
	public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable String userId) {

		userService.deleteUser(userId);
		return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
	}

	// ==============================
	// GET USERS BY ROLE
	// ==============================
	@GetMapping("/role/{roleId}")
	@PreAuthorize("hasAuthority('VIEW_USERS_BY_ROLE')")
	public ResponseEntity<ApiResponse<PaginationResponse<?>>> getUsersByRole(@PathVariable String roleId,
			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity.ok(ApiResponse.success("Users fetched successfully",
				userService.getAllUserByRole(roleId, pageNo, pageSize)));
	}

	// ==============================
	// GET PENDING USERS BY ADMIN
	// ==============================
	@GetMapping("/pending")
	@PreAuthorize("hasAuthority('VIEW_PENDING_USERS')")
	public ResponseEntity<ApiResponse<PaginationResponse<?>>> getPendingUsers(
			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity.ok(ApiResponse.success("Pending users fetched successfully",
				userService.getAllPendingRequest(pageNo, pageSize)));
	}

	// ==============================
	// GET ALL USERS
	// ==============================
	@GetMapping
	@PreAuthorize("hasAuthority('VIEW_ALL_USERS')")
	public ResponseEntity<ApiResponse<PaginationResponse<?>>> getAllUsers(@RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity
				.ok(ApiResponse.success("Users fetched successfully", userService.getAll(pageNo, pageSize)));
	}

	// ==============================
	// APPROVE USER REQUEST
	// ==============================
	@PatchMapping("/approve/{userId}")
	@PreAuthorize("hasAuthority('APPROVE_USER')")
	public ResponseEntity<ApiResponse<?>> approveUser(@PathVariable String userId) {

		userService.approveRequest(userId);
		return ResponseEntity.ok(ApiResponse.success("User approved successfully"));
	}

	// ==============================
	// REJECT USER REQUEST
	// ==============================
	@PatchMapping("/reject/{userId}")
	@PreAuthorize("hasAuthority('REJECT_USER')")
	public ResponseEntity<ApiResponse<?>> rejectUser(@PathVariable String userId) {

		userService.rejectRequest(userId);
		return ResponseEntity.ok(ApiResponse.success("User rejected successfully"));
	}

	// ==============================
	// TOGGLE USER STATUS
	// ==============================
	@PatchMapping("/toggle-status/{userId}")
	@PreAuthorize("hasAuthority('TOGGLE_USER_STATUS')")
	public ResponseEntity<ApiResponse<?>> toggleStatus(@PathVariable String userId) {

		userService.toggalStatus(userId);
		return ResponseEntity.ok(ApiResponse.success("User status updated successfully"));
	}

//	// ==============================
//	// GET ALL SUPER ADMINS
//	// ==============================
//	@GetMapping("/super-admins")
//	@PreAuthorize("hasAuthority('VIEW_SUPER_ADMINS')")
//	public ResponseEntity<ApiResponse<PaginationResponse<?>>> getAllSuperAdmins(
//			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int pageSize) {
//
//		return ResponseEntity.ok(ApiResponse.success("Super admins fetched successfully",
//				userService.getAllSuperAdmins(pageNo, pageSize)));
//	}
//
//	// ==============================
//	// GET ALL ADMINS
//	// ==============================
//	@GetMapping("/admins")
//	@PreAuthorize("hasAuthority('VIEW_ADMINS')")
//	public ResponseEntity<ApiResponse<PaginationResponse<?>>> getAllAdmins(@RequestParam(defaultValue = "0") int pageNo,
//			@RequestParam(defaultValue = "10") int pageSize) {
//
//		return ResponseEntity
//				.ok(ApiResponse.success("Admins fetched successfully", userService.getAllAdmins(pageNo, pageSize)));
//	}

	// ==============================
	// GET USERS BY ADMIN
	// ==============================
//	@GetMapping("/admin/{adminId}")
//	@PreAuthorize("hasAuthority('VIEW_USERS_BY_ADMIN')")
//	public ResponseEntity<ApiResponse<PaginationResponse<?>>> getUsersByAdmin(@PathVariable String adminId,
//			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int pageSize) {
//
//		return ResponseEntity.ok(ApiResponse.success("Users fetched successfully",
//				userService.getAllUserByAdmin(adminId, pageNo, pageSize)));
//	}

}

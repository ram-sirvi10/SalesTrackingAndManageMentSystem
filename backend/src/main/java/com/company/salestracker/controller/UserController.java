package com.company.salestracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    // CURRENT USER
    // ==============================
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();
        UserResponse user = userService.getUserByEmail(email);

        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", user));
    }

    // ==============================
    // UPDATE USER
    // ==============================
    @PatchMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER_UPDATE') or #userId == authentication.principal.id")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User updated successfully",
                        userService.updateUser(userId, request)
                )
        );
    }

    // ==============================
    // DELETE USER
    // ==============================
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable String userId) {

        userService.deleteUser(userId);

        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    // ==============================
    // VIEW USERS BY ROLE
    // ==============================
    @GetMapping("/role/{roleId}")
    @PreAuthorize("hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<PaginationResponse<?>>> getUsersByRole(
            @PathVariable String roleId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Users fetched successfully",
                        userService.getAllUserByRole(roleId, pageNo, pageSize)
                )
        );
    }

    // ==============================
    // VIEW PENDING USERS
    // ==============================
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<PaginationResponse<?>>> getPendingUsers(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Pending users fetched successfully",
                        userService.getAllPendingRequest(pageNo, pageSize)
                )
        );
    }

    // ==============================
    // VIEW ALL USERS
    // ==============================
    @GetMapping
    @PreAuthorize("hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<PaginationResponse<?>>> getAllUsers(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search) {

        if(pageSize > 100) pageSize = 100;

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Users fetched successfully",
                        userService.getAll(pageNo, pageSize, search)
                )
        );
    }

    // ==============================
    // APPROVE USER
    // ==============================
    @PatchMapping("/approve/{userId}")
    @PreAuthorize("hasAuthority('USER_APPROVE')")
    public ResponseEntity<ApiResponse<?>> approveUser(@PathVariable String userId) {

        userService.approveRequest(userId);

        return ResponseEntity.ok(ApiResponse.success("User approved successfully"));
    }

    // ==============================
    // REJECT USER
    // ==============================
    @PatchMapping("/reject/{userId}")
    @PreAuthorize("hasAuthority('USER_APPROVE')")
    public ResponseEntity<ApiResponse<?>> rejectUser(@PathVariable String userId) {

        userService.rejectRequest(userId);

        return ResponseEntity.ok(ApiResponse.success("User rejected successfully"));
    }

    // ==============================
    // TOGGLE USER STATUS
    // ==============================
    @PatchMapping("/toggle-status/{userId}")
    @PreAuthorize("hasAuthority('USER_STATUS_UPDATE')")
    public ResponseEntity<ApiResponse<?>> toggleStatus(@PathVariable String userId) {

        userService.toggalStatus(userId);

        return ResponseEntity.ok(ApiResponse.success("User status updated successfully"));
    }

    // ==============================
    // GET USER BY ID
    // ==============================
    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER_VIEW') or #userId == authentication.principal.id")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String userId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User fetched successfully",
                        userService.getUserById(userId)
                )
        );
    }
    
    
}

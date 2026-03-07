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
    // VIEW ALL PERMISSIONS
    // ==============================
    @GetMapping
    @PreAuthorize("hasAuthority('PERMISSION_VIEW')")
    public ResponseEntity<ApiResponse<List<?>>> viewAllPermissions() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Permissions fetched successfully",
                        permissionService.getAllPermission()
                )
        );
    }

    // ==============================
    // VIEW PERMISSIONS BY ROLE
    // ==============================
    @GetMapping("/roles/{roleId}")
    @PreAuthorize("hasAuthority('PERMISSION_VIEW')")
    public ResponseEntity<ApiResponse<List<?>>> viewPermissionsByRole(@PathVariable String roleId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Permissions fetched successfully",
                        permissionService.getAllPermissionByRole(roleId)
                )
        );
    }

    // ==============================
    // VIEW PERMISSIONS BY USER
    // ==============================
    @GetMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('PERMISSION_VIEW') or #userId == authentication.principal.id")
    public ResponseEntity<ApiResponse<List<?>>> viewPermissionsByUser(@PathVariable String userId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Permissions fetched successfully",
                        permissionService.getAllPermissionByUser(userId)
                )
        );
    }
}
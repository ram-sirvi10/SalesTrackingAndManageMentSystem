package com.company.salestracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.AssignRolesRequest;
import com.company.salestracker.dto.request.RemoveRoleRequest;
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

    // ==============================
    // CREATE ROLE
    // ==============================
    @PostMapping("/create-role")
    @PreAuthorize("hasAuthority('ROLE_CREATE')")
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(@Valid @RequestBody RoleRequest roleRequest) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Role created successfully",
                        roleService.createRole(roleRequest)
                ));
    }


    // ==============================
    // VIEW ALL ROLES
    // ==============================
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_VIEW')")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getRoles() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Roles fetched successfully",
                        roleService.getAllRoll()
                )
        );
    }


    // ==============================
    // ADD SINGLE PERMISSION
    // ==============================
    @PatchMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('PERMISSION_ASSIGN')")
    public ResponseEntity<ApiResponse<?>> addPermission(
            @PathVariable String roleId,
            @PathVariable String permissionId) {

        roleService.addPermissionToRole(roleId, permissionId);

        return ResponseEntity.ok(
                ApiResponse.success("Permission added successfully")
        );
    }


    // ==============================
    // ADD BULK PERMISSIONS
    // ==============================
    @PatchMapping("/{roleId}/permissions")
    @PreAuthorize("hasAuthority('PERMISSION_ASSIGN')")
    public ResponseEntity<ApiResponse<?>> addPermissionsToRole(
            @PathVariable String roleId,
            @Valid @RequestBody UpdateRolePermissionRequest request) {

        roleService.addPermissionsToRole(roleId, request.getPermissions());

        return ResponseEntity.ok(
                ApiResponse.success("Permissions added successfully")
        );
    }


    // ==============================
    // REMOVE PERMISSION
    // ==============================
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('PERMISSION_REMOVE')")
    public ResponseEntity<ApiResponse<?>> removePermission(
            @PathVariable String roleId,
            @PathVariable String permissionId) {

        roleService.removePermissionFromRole(roleId, permissionId);

        return ResponseEntity.ok(
                ApiResponse.success("Permission removed successfully")
        );
    }


    // ==============================
    // UPDATE ROLE
    // ==============================
    @PutMapping("/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(
            @PathVariable String roleId,
            @Valid @RequestBody RoleRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Role updated successfully",
                        roleService.updateRole(roleId, request)
                )
        );
    }


    // ==============================
    // GET ROLE BY ID
    // ==============================
    @GetMapping("/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_VIEW')")
    public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(@PathVariable String roleId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Role fetched successfully",
                        roleService.getRoleById(roleId)
                )
        );
    }


    // ==============================
    // GET ROLE OF USER
    // ==============================
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ROLE_VIEW') or #userId == authentication.principal.id")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getUserRoles(@PathVariable String userId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User roles fetched successfully",
                        roleService.getRolesByUser(userId)
                )
        );
    }


    // ==============================
    // ASSIGN ROLE TO USER
    // ==============================
    @PatchMapping("/assign-role")
    @PreAuthorize("hasAuthority('ROLE_ASSIGN')")
    public ResponseEntity<ApiResponse<?>> assignRoleToUser(@Valid @RequestBody AssignRolesRequest request) {

        roleService.assignRolesToUser(request);

        return ResponseEntity.ok(
                ApiResponse.success("Roles assigned successfully")
        );
    }


    // ==============================
    // REMOVE ROLE FROM USER
    // ==============================
    @DeleteMapping("/remove-role")
    @PreAuthorize("hasAuthority('ROLE_REMOVE')")
    public ResponseEntity<ApiResponse<?>> removeRoleFromUser(@Valid @RequestBody RemoveRoleRequest request) {

        roleService.removeRoleFromUser(request.getUserId(), request.getRoleId());

        return ResponseEntity.ok(
                ApiResponse.success("Role removed successfully")
        );
    }


    // ==============================
    // DELETE ROLE
    // ==============================
    @DeleteMapping("/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_DELETE')")
    public ResponseEntity<ApiResponse<?>> deleteRole(@PathVariable String roleId) {

        roleService.deleteRole(roleId);

        return ResponseEntity.ok(
                ApiResponse.success("Role deleted successfully")
        );
    }
}
package com.company.salestracker.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.company.salestracker.dto.request.UserRequest;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.PermissionResponse;
import com.company.salestracker.dto.response.RoleResponse;
import com.company.salestracker.dto.response.UserResponse;
import com.company.salestracker.entity.Permission;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;

public class Mapper {

	public static User toEntity(UserRequest request, Set<Role> roles) {

		if (request == null)
			return null;

		return User.builder().name(request.getName()).email(request.getEmail()).phone(request.getPhone())
				.password(request.getPassword()).roles(roles).build();
	}

	public static UserResponse toResponse(User user) {

		if (user == null)
			return null;

		return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail())
				.phone(user.getPhone()).status(user.getStatus().name()).roles(toRoleResponseSet(user.getRoles()))
				.build();
	}

	public static RoleResponse toResponse(Role role) {

		if (role == null)
			return null;

		return RoleResponse.builder().id(role.getId()).roleName(role.getRoleName()).description(role.getDescription())
				.permissions(toPermissionResponseSet(role.getPermissions())).build();
	}

	public static PermissionResponse toResponse(Permission permission) {

		if (permission == null)
			return null;

		return PermissionResponse.builder().id(permission.getId()).permissionCode(permission.getPermissionCode())
				.description(permission.getDescription()).build();
	}

	public static Set<RoleResponse> toRoleResponseSet(Set<Role> roles) {

		if (roles == null)
			return null;
		return roles.stream().map(Mapper::toResponse).collect(Collectors.toSet());
	}

	public static Set<PermissionResponse> toPermissionResponseSet(Set<Permission> permissions) {

		if (permissions == null)
			return null;

		return permissions.stream().map(Mapper::toResponse).collect(Collectors.toSet());
	}
	
	  public static PaginationResponse<?> toPaginationResponse(Page<?> page) {
			return PaginationResponse.builder().content(page.getContent()).pageNumber(page.getNumber())
				.pageSize(page.getSize()).totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
				.lastPage(page.isLast()).firstPage(page.isFirst()).build();
		    }
}

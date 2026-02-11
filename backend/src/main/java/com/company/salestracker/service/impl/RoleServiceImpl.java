package com.company.salestracker.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.AssignRolesRequest;
import com.company.salestracker.dto.request.CreateRoleRequest;
import com.company.salestracker.dto.response.RoleResponse;
import com.company.salestracker.entity.Permission;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.PermissionRepository;
import com.company.salestracker.repository.RoleRepository;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.service.RoleService;
import com.company.salestracker.util.AppConstant;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

	private final RoleRepository roleRepo;
	private final PermissionRepository permissionRepo;
	private final UserRepository userRepo;

	@Override
	public RoleResponse createRole(CreateRoleRequest request) {

		User loginUser = currentLoginUser();

		User ownerAdmin = loginUser.getOwnerAdmin();
		request.setRoleName(request.getRoleName().toUpperCase());
		Optional<Role> existingRole = null;
		if (ownerAdmin != null)
			existingRole = roleRepo.findByOwnerAdminAndRoleName(ownerAdmin, request.getRoleName());
		else
			existingRole = roleRepo.findByRoleNameAndOwnerAdminIsNull(request.getRoleName());
		if (existingRole.isPresent()) {
			throw new BadRequestException(AppConstant.ROLE_ALREADY_EXIXT);
		}

		Set<Permission> permissions = new HashSet<>(permissionRepo.findAllById(request.getPermissions()));

		Role role = Role.builder().roleName(request.getRoleName()).permissions(permissions).ownerAdmin(ownerAdmin)
				.createdBy(loginUser).build();
 

		return Mapper.toResponse(roleRepo.save(role));

	}

	@Override
	public List<RoleResponse> allRoleByAdmin(String adminId) {

		User loginUser = currentLoginUser();

		User requestedAdmin = userRepo.findById(adminId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (loginUser.getOwnerAdmin() != null) {

			User ownerAdmin = loginUser.getOwnerAdmin();

			if (!ownerAdmin.getId().equals(requestedAdmin.getId())) {
				throw new BadRequestException("Not allowed to view roles");
			}
		}

		return roleRepo.findByOwnerAdmin(requestedAdmin).stream().map(Mapper::toResponse).collect(Collectors.toList());
	}

	@Override
	public List<RoleResponse> viewAllDefaultRole() {
		return roleRepo.findByOwnerAdminIsNull().stream().map(Mapper::toResponse).collect(Collectors.toList());
	}

	@Override
	public Boolean assignRolesToUser(AssignRolesRequest request) {

		User currentLoginUser = currentLoginUser();

		User ownerAdmin = currentLoginUser.getOwnerAdmin() == null ? currentLoginUser
				: currentLoginUser.getOwnerAdmin();

		User targetUser = userRepo.findById(request.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (targetUser.getOwnerAdmin() != null && !targetUser.getOwnerAdmin().getId().equals(ownerAdmin.getId())) {

			throw new BadRequestException("Cannot manage this user");
		}

		Set<Role> roles = new HashSet<>(roleRepo.findAllById(request.getRoles()));

		roles.forEach(role -> {

			if (role.getOwnerAdmin() != null && !role.getOwnerAdmin().getId().equals(ownerAdmin.getId())) {

				throw new BadRequestException(AppConstant.ROLES_INVALID);
			}
		});

		targetUser.setRoles(roles);
		userRepo.save(targetUser);
		return true;
	}

	private User currentLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return userRepo.findByEmail(authentication.getName()).orElseThrow();
	}

}

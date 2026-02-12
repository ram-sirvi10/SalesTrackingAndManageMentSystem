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
import com.company.salestracker.dto.request.RoleRequest;
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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

	private final RoleRepository roleRepo;
	private final PermissionRepository permissionRepo;
	private final UserRepository userRepo;

	@Override
	@Transactional
	public RoleResponse createRole(RoleRequest request) {

		User loginUser = currentLoginUser();
		User ownerAdmin = loginUser.getOwnerAdmin();

		request.setRoleName(request.getRoleName().toUpperCase());

		Optional<Role> existingRole = findExistingRole(ownerAdmin, request.getRoleName());

		if (existingRole.isPresent()) {

			Role role = existingRole.get();

			if (Boolean.TRUE.equals(role.getIsDelete())) {

				role.setIsDelete(false);
				role.setDescription(request.getDescription());

				role.setPermissions(validatePermissions(request.getPermissions()));

				return Mapper.toResponse(roleRepo.save(role));
			}

			throw new BadRequestException(AppConstant.ROLE_ALREADY_EXIXT);
		}

		Set<Permission> permissions = new HashSet<>(permissionRepo.findAllById(request.getPermissions()));

		Role role = Role.builder().roleName(request.getRoleName()).permissions(permissions).ownerAdmin(ownerAdmin)
				.description(request.getDescription()).createdBy(loginUser).build();

		return Mapper.toResponse(roleRepo.save(role));
	}

	@Transactional
	@Override
	public RoleResponse updateRole(String roleId, RoleRequest request) {

		Role role = checkRoleBelongToCurrentUser(roleId);

		request.setRoleName(request.getRoleName().toUpperCase());

		// Duplicate validation
		Optional<Role> existingRole = findExistingRole(role.getOwnerAdmin(), request.getRoleName());

		if (existingRole.isPresent() && !existingRole.get().getId().equals(roleId)) {

			throw new BadRequestException(AppConstant.ROLE_ALREADY_EXIXT);
		}

		role.setRoleName(request.getRoleName());
		role.setDescription(request.getDescription());

		if (request.getPermissions() != null && !request.getPermissions().isEmpty()) {
			role.setPermissions(validatePermissions(request.getPermissions()));
		}

		return Mapper.toResponse(roleRepo.save(role));
	}

	@Override
	public List<RoleResponse> getAllRolesByAdmin(String adminId) {

		User loginUser = currentLoginUser();

		User requestedAdmin = userRepo.findById(adminId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (loginUser.getOwnerAdmin() != null) {

			User ownerAdmin = loginUser.getOwnerAdmin();

			if (!ownerAdmin.getId().equals(requestedAdmin.getId())) {
				throw new BadRequestException("Not allowed to view roles");
			}
		}

		return roleRepo.findByOwnerAdminAndIsDeleteFalse(requestedAdmin).stream().map(Mapper::toResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<RoleResponse> viewAllDefaultRole() {
		return roleRepo.findByOwnerAdminIsNullAndIsDeleteFalse().stream().map(Mapper::toResponse)
				.collect(Collectors.toList());
	}

	@Override
	public RoleResponse getRoleById(String roleId) {

		Role role = checkRoleBelongToCurrentUser(roleId);

		return Mapper.toResponse(role);
	}

	@Override
	public List<RoleResponse> getRolesByUser(String userId) {

		User loginUser = currentLoginUser();

		User ownerAdmin = loginUser.getOwnerAdmin() == null ? loginUser : loginUser.getOwnerAdmin();

		User targetUser = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (targetUser.getOwnerAdmin() != null && !targetUser.getOwnerAdmin().getId().equals(ownerAdmin.getId())) {
			throw new BadRequestException("Cannot view roles of this user");
		}

		return targetUser.getRoles().stream().filter(r -> !Boolean.TRUE.equals(r.getIsDelete())).map(Mapper::toResponse)
				.collect(Collectors.toList());
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
		boolean isSuperAdmin = isNewSuperAdmin(roles);
		if (!isSuperAdmin && targetUser.getOwnerAdmin() == null) {
			targetUser.setOwnerAdmin(targetUser);
		}

		targetUser.setRoles(roles);
		userRepo.save(targetUser);
		return true;
	}

	@Transactional
	@Override
	public Boolean removeRoleFromUser(String userId, String roleId) {

		User loginUser = currentLoginUser();

		User ownerAdmin = loginUser.getOwnerAdmin() == null ? loginUser : loginUser.getOwnerAdmin();

		User targetUser = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (targetUser.getOwnerAdmin() != null && !targetUser.getOwnerAdmin().getId().equals(ownerAdmin.getId())) {
			throw new BadRequestException("Cannot manage this user");
		}

		Role role = roleRepo.findById(roleId).filter(r -> !Boolean.TRUE.equals(r.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException("Role not found"));

		if (!targetUser.getRoles().contains(role)) {
			throw new BadRequestException("User does not have this role assigned");
		}

		targetUser.getRoles().remove(role);

		userRepo.save(targetUser);

		return true;
	}

	@Transactional
	@Override
	public Boolean deleteRole(String roleId) {

		Role role = checkRoleBelongToCurrentUser(roleId);
		// not delete default role
		if (role.getCreatedBy() == null && role.getOwnerAdmin() == null) {
			throw new BadRequestException("Not deleted this role");
		}
		userRepo.removeRoleMappings(roleId);
		role.setIsDelete(true);
		roleRepo.save(role);
		return true;
	}

	@Transactional
	@Override
	public void addPermissionToRole(String roleId, String permissionId) {
		Role role = checkRoleBelongToCurrentUser(roleId);
		Permission permission = permissionRepo.findById(permissionId)
				.orElseThrow(() -> new BadRequestException("Permission not found"));

		role.getPermissions().add(permission);
		roleRepo.save(role);
	}

	@Transactional
	@Override
	public void addPermissionsToRole(String roleId, List<String> permissionIds) {

		if (permissionIds == null || permissionIds.isEmpty()) {
			throw new BadRequestException("Permission ids cannot be empty");
		}

		Role role = checkRoleBelongToCurrentUser(roleId);

		Set<Permission> permissions = new HashSet<>(permissionRepo.findAllById(permissionIds));

		// Validate all ids exist
		if (permissions.size() != permissionIds.size()) {
			throw new BadRequestException("Invalid permission ids");
		}

		role.getPermissions().addAll(permissions);

		roleRepo.save(role);
	}

	@Transactional
	@Override
	public void removePermissionFromRole(String roleId, String permissionId) {

		Role role = checkRoleBelongToCurrentUser(roleId);
		Permission permission = permissionRepo.findById(permissionId)
				.orElseThrow(() -> new RuntimeException("Permission not found"));

		role.getPermissions().remove(permission);

		roleRepo.save(role);
	}

	private Role checkRoleBelongToCurrentUser(String roleId) {

		User loginUser = currentLoginUser();
		User ownerAdmin = loginUser.getOwnerAdmin();

		Role role = roleRepo.findById(roleId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new BadRequestException("Role not found"));
		if (ownerAdmin != null && !role.getOwnerAdmin().getId().equalsIgnoreCase(ownerAdmin.getId())) {
			throw new BadRequestException("Role not found");
		}

		return role;
	}

	private Optional<Role> findExistingRole(User ownerAdmin, String roleName) {
		if (ownerAdmin != null)
			return roleRepo.findByOwnerAdminAndRoleName(ownerAdmin, roleName);

		return roleRepo.findByRoleNameAndOwnerAdminIsNullAndIsDeleteFalse(roleName);
	}

	private User currentLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return userRepo.findByEmail(authentication.getName()).orElseThrow();
	}

	private boolean isNewSuperAdmin(Set<Role> roles) {

		if (roles.size() > 1)
			return false;
		if (roles.stream().filter(role -> role.getCreatedBy() == null).toList().isEmpty())
			return false;
		return true;
	}

	private Set<Permission> validatePermissions(Set<String> permissionIds) {

		Set<Permission> permissions = new HashSet<>(permissionRepo.findAllById(permissionIds));

		if (permissions.size() != permissionIds.size()) {
			throw new BadRequestException("Invalid permission ids");
		}

		return permissions;
	}

}

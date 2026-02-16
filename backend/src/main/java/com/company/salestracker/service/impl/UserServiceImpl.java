package com.company.salestracker.service.impl;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.UpdateUserRequest;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.UserResponse;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.RoleRepository;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.service.UserService;
import com.company.salestracker.util.AppConstant;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepo;
	private final RoleRepository roleRepo;

	@Override
	@Transactional
	public UserResponse updateUser(String userId, UpdateUserRequest request) {

		User user = getActiveUser(userId);

		if (!userId.equals(currentLoginUser().getId())) {
			if (user.getRoles().stream().flatMap(role -> role.getPermissions().stream()).distinct()
					.filter(per -> per.getPermissionCode().equals("UPADTE-USER")).collect(Collectors.toList())
					.size() >= 1) {

				validateUserManagementAccess(user);
			} else
				throw new BadRequestException("You don't have permission to manage other user");

		}

		user.setName(request.getName());
		user.setPhone(request.getPhone());

		return Mapper.toResponse(userRepo.save(user));
	}

	@Override
	public void approveRequest(String userId) {

		User user = getActiveUser(userId);

		validateUserManagementAccess(user);

		if (!UserStatus.PENDING.equals(user.getStatus())) {
			throw new BadRequestException("Only pending users can be approved");
		}

		user.setStatus(UserStatus.ACTIVE);
		user.setUpdatedAt(LocalDateTime.now());

		userRepo.save(user);
	}

	@Override
	public void rejectRequest(String userId) {

		User user = getActiveUser(userId);

		validateUserManagementAccess(user);

		if (!UserStatus.PENDING.equals(user.getStatus())) {
			throw new BadRequestException("Only pending users can be rejected");
		}

		user.setStatus(UserStatus.REJECTED);
		user.setUpdatedAt(LocalDateTime.now());

		userRepo.save(user);
	}

	@Override
	public void toggalStatus(String userId) {

		User user = getActiveUser(userId);
		User currentUser = currentLoginUser();

		if (currentUser.getId().equals(userId)) {
			throw new BadRequestException("You cannot change your own status");
		}

		validateUserManagementAccess(user);

		if (UserStatus.ACTIVE.equals(user.getStatus())) {
			user.setStatus(UserStatus.INACTIVE);
			if (isOwnerAdmin(user)) {

				userRepo.inactiveAllUserByOwnerAdmin(user);
			}

		} else if (UserStatus.INACTIVE.equals(user.getStatus())) {
			user.setStatus(UserStatus.ACTIVE);
			if (isOwnerAdmin(user)) {

				userRepo.activeAllUserByOwnerAdmin(user);
			}

		} else {
			throw new BadRequestException("Only ACTIVE or INACTIVE users can be toggled");
		}

		user.setUpdatedAt(LocalDateTime.now());

		userRepo.save(user);
	}

	@Transactional
	@Override
	public void deleteUser(String userId) {

		User user = getActiveUser(userId);
		if (currentLoginUser().getId().equals(userId)) {
			throw new BadRequestException("You cannot delete yourself");
		}
		validateUserManagementAccess(user);
		LocalDateTime now = LocalDateTime.now();
		if (isOwnerAdmin(user)) {
			userRepo.deleteAllUserByAdmin(user);
			userRepo.inactiveAllUserByOwnerAdmin(user);
		}
		user.setStatus(UserStatus.INACTIVE);
		user.setIsDelete(true);
		user.setUpdatedAt(now);
		userRepo.save(user);
	}

	@Override
	public PaginationResponse<?> getAllUserByRole(String roleId, int pageNo, int pageSize) {
		Role role = checkRoleBelongToCurrentUser(roleId);

		Pageable pageable = PageRequest.of(pageNo, pageSize);
		Page<User> users = userRepo.findByRolesIdAndIsDeleteFalse(role.getId(), pageable);
		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> getAllPendingRequest(int pageNo, int pageSize) {

		User admin = currentLoginUser().getOwnerAdmin();
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		if (admin != null) {

			Page<User> users = userRepo.findByOwnerAdminAndStatusAndIsDeleteFalse(admin, UserStatus.PENDING, pageable);

			return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
		} else {
			Page<User> users = userRepo.findAllAdminPandingRequest(pageable);

			return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
		}
	}

//	@Override
//	public PaginationResponse<?> getAllUsers(int pageNo, int pageSize) {
//
//		Pageable pageable = PageRequest.of(pageNo, pageSize);
//
//		Page<User> users = userRepo.findByIsDeleteFalse(pageable);
//
//		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
//	}

//	@Override
//	public PaginationResponse<?> getAllUserByAdmin(String adminId, int pageNo, int pageSize) {
//		User admin = getActiveUser(adminId);
//		validateUserManagementAccess(admin);
//		Pageable pageable = PageRequest.of(pageNo, pageSize);
//		Page<User> users = userRepo.findByOwnerAdminAndStatusNotAndIsDeleteFalse(admin, UserStatus.PENDING, pageable);
//		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
//	}

	@Override
	public PaginationResponse<?> getAll(int pageNo, int pageSize) {
		User loginUser = currentLoginUser();
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		if (loginUser.getOwnerAdmin() != null) {
			Page<User> users = userRepo.findByOwnerAdminAndStatusNotAndIsDeleteFalse(loginUser.getOwnerAdmin(),
					UserStatus.PENDING, pageable);
			return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
		}

		return Mapper.toPaginationResponse(userRepo.findAllSuperAndSelfAdmins(pageable).map(Mapper::toResponse));

	}

//	@Override
//	public PaginationResponse<?> getAllSuperAdmins(int pageNo, int pageSize) {
//
//		Pageable pageable = PageRequest.of(pageNo, pageSize);
//
//		Page<User> users = userRepo.findByOwnerAdminIsNullAndIsDeleteFalse(pageable);
//
//		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
//	}
//
//	@Override
//	public PaginationResponse<?> getAllAdmins(int pageNo, int pageSize) {
//
//		Pageable pageable = PageRequest.of(pageNo, pageSize);
//
//		Page<User> users = userRepo.findSelfOwnerAdmins(pageable);
//
//		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
//	}

	private User getActiveUser(String id) {
		User user = userRepo.findById(id).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
		if (!user.getStatus().equals(UserStatus.ACTIVE)) {
			throw new ResourceNotFoundException("User is blocked");
		}
		return user;
	}

	private User currentLoginUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getName() == null) {
			throw new BadRequestException("User not authenticated");
		}

		return userRepo.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResourceNotFoundException("Logged user not found"));
	}

	private void validateUserManagementAccess(User targetUser) {

		User currentUser = currentLoginUser();

		// Root super admin protection
		if (isRootSuperAdmin(targetUser)) {
			throw new BadRequestException("Main super admin cannot be modified");
		}

//		// Root super admin → full access
//		if (isRootSuperAdmin(currentUser)) {
//			return;
//		}

		// =============================
		// Super Admin
		// =============================
		if (isSuperAdmin(currentUser)) {

			if (isSubUser(targetUser)) {
				throw new BadRequestException("Super admin cannot manage admin users");
			}
			if (isSuperAdmin(targetUser)) {
				throw new BadRequestException("Super admin cannot manage other super admin");
			}
			return;
		}

		// =============================
		// Owner Admin
		// =============================
		if (isOwnerAdmin(currentUser)) {

			if (!targetUser.getOwnerAdmin().getId().equals(currentUser.getId())) {
				throw new BadRequestException("You can only manage your own users");
			}
			return;
		}

		// =============================
		// Sub User
		// =============================
		if (isSubUser(currentUser)) {

			if (isOwnerAdmin(targetUser)) {
				throw new BadRequestException("You can not manage admin");
			}
			if (!isSubUser(targetUser)
					|| !targetUser.getOwnerAdmin().getId().equals(currentUser.getOwnerAdmin().getId())) {

				throw new BadRequestException("You can only manage users under same admin");
			}
			return;
		}

		throw new BadRequestException("You are not allowed to manage users");
	}

	private boolean isRootSuperAdmin(User user) {
		return user.getOwnerAdmin() == null && user.getCreatedBy() == null;
	}

	private boolean isSuperAdmin(User user) {
		return user.getOwnerAdmin() == null && user.getCreatedBy() != null;
	}

	private boolean isOwnerAdmin(User user) {
		return user.getOwnerAdmin() != null && user.getOwnerAdmin().getId().equals(user.getId());
	}

	private boolean isSubUser(User user) {
		return user.getOwnerAdmin() != null && !user.getOwnerAdmin().getId().equals(user.getId());
	}

	private Role checkRoleBelongToCurrentUser(String roleId) {

		User loginUser = currentLoginUser();
		User ownerAdmin = loginUser.getOwnerAdmin();

		Role role = roleRepo.findById(roleId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new BadRequestException("Role not found"));
		if (ownerAdmin != null) {
			if (role.getOwnerAdmin() == null || !role.getOwnerAdmin().getId().equalsIgnoreCase(ownerAdmin.getId())) {
				throw new BadRequestException("Role not found");
			}
		}

		if (ownerAdmin == null && role.getOwnerAdmin() != null) {
			throw new BadRequestException("Not manage this role");
		}

		return role;
	}

}
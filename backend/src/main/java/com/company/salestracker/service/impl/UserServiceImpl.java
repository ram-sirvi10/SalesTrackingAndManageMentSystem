package com.company.salestracker.service.impl;

import java.time.LocalDateTime;

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

		validateUserManagementAccess(user);

		user.setName(request.getName());
		user.setPhone(request.getPhone());
		user.setUpdatedAt(LocalDateTime.now());

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

		} else if (UserStatus.INACTIVE.equals(user.getStatus())) {
			user.setStatus(UserStatus.ACTIVE);

		} else {
			throw new BadRequestException("Only ACTIVE or INACTIVE users can be toggled");
		}

		user.setUpdatedAt(LocalDateTime.now());

		userRepo.save(user);
	}

	@Override
	public void deleteUser(String userId) {

		User user = getActiveUser(userId);

		validateUserManagementAccess(user);

		user.setIsDelete(true);
		user.setUpdatedAt(LocalDateTime.now());

		userRepo.save(user);
	}

	@Override
	public PaginationResponse<?> getAllUserByAdmin(String adminId, int pageNo, int pageSize) {

		User admin = getActiveUser(adminId);
		validateAdminAccessForViewUsers(adminId);

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<User> users = userRepo.findByOwnerAdminAndStatusNotAndIsDeleteFalse(admin, UserStatus.PENDING, pageable);

		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> getAllUserByRole(String roleId, int pageNo, int pageSize) {
		Role role = roleRepo.findById(roleId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException("Role not found"));
		validateAdminAccessForViewUsers(role.getOwnerAdmin().getId());
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		Page<User> users = userRepo.findByRolesIdAndIsDeleteFalse(role.getId(), pageable);
		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> getAllPendingRequestByAdmin(String adminId, int pageNo, int pageSize) {

		User admin = getActiveUser(adminId);
		validateAdminAccessForViewUsers(adminId);

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<User> users = userRepo.findByOwnerAdminAndStatusAndIsDeleteFalse(admin, UserStatus.PENDING, pageable);

		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> getAllUsers(int pageNo, int pageSize) {

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<User> users = userRepo.findByIsDeleteFalse(pageable);

		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> getAllSuperAdmins(int pageNo, int pageSize) {

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<User> users = userRepo.findByOwnerAdminIsNullAndIsDeleteFalse(pageable);

		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> getAllAdmins(int pageNo, int pageSize) {

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<User> users = userRepo.findSelfOwnerAdmins(pageable);

		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
	}

	private User getActiveUser(String id) {
		return userRepo.findById(id).filter(user -> !Boolean.TRUE.equals(user.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
	}

	private void validateAdminAccessForViewUsers(String id) {

		User currentUser = currentLoginUser();

		if (currentUser.getOwnerAdmin() != null && !currentUser.getOwnerAdmin().getId().equals(id)) {

			throw new BadRequestException("Invalid request. You cannot view other admin users");
		}

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

}
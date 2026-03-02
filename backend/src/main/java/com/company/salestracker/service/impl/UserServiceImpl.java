package com.company.salestracker.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.service.UserService;
import com.company.salestracker.util.AppCommon;
import com.company.salestracker.util.AppConstant;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepo;
	private final AppCommon appCommon;

	@Override
	@Transactional
	public UserResponse updateUser(String userId, UpdateUserRequest request) {

		User user = userRepo.findById(userId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (!userId.equals(appCommon.currentLoginUser().getId())) {
			appCommon.validateUserManagementAccess(user);
		}

		user.setName(request.getName());
		user.setPhone(request.getPhone());

		return Mapper.toResponse(userRepo.save(user));
	}

	@Override
	public void approveRequest(String userId) {

		User user = userRepo.findById(userId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		appCommon.validateUserManagementAccess(user);

		if (!UserStatus.PENDING.equals(user.getStatus())) {
			throw new BadRequestException("Only pending users can be approved");
		}

		user.setStatus(UserStatus.ACTIVE);
		user.setUpdatedAt(LocalDateTime.now());

		userRepo.save(user);
	}

	@Override
	public void rejectRequest(String userId) {

		User user = userRepo.findById(userId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
		appCommon.validateUserManagementAccess(user);

		if (!UserStatus.PENDING.equals(user.getStatus())) {
			throw new BadRequestException("Only pending users can be rejected");
		}

		user.setStatus(UserStatus.REJECTED);
		user.setUpdatedAt(LocalDateTime.now());
		user.setIsDelete(true);
		userRepo.save(user);
	}

	@Override

    @Transactional
	public void toggalStatus(String userId) {

		User user = userRepo.findById(userId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
		User currentUser = appCommon.currentLoginUser();

		if (currentUser.getId().equals(userId)) {
			throw new BadRequestException("You cannot change your own status");
		}
		appCommon.validateUserManagementAccess(user);

		if (UserStatus.ACTIVE.equals(user.getStatus())) {
			user.setStatus(UserStatus.INACTIVE);
			if (appCommon.isOwnerAdmin(user)) {

				userRepo.inactiveAllUserByOwnerAdmin(user);
			}

		} else if (UserStatus.INACTIVE.equals(user.getStatus())) {
			user.setStatus(UserStatus.ACTIVE);
			if (appCommon.isOwnerAdmin(user)) {

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

		User user = userRepo.findById(userId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
//	 	if(isOwnerAdmin(user)) {
//			throw new BadRequestException("Admin can not ");
//		}
		if (appCommon.currentLoginUser().getId().equals(userId)) {
			throw new BadRequestException("You cannot delete yourself");
		}
		appCommon.validateUserManagementAccess(user);
		LocalDateTime now = LocalDateTime.now();
		if (appCommon.isOwnerAdmin(user)) {
			throw new BadRequestException("Can not delete admin ");
//			userRepo.deleteAllUserByAdmin(user);
//			userRepo.inactiveAllUserByOwnerAdmin(user);
		}
		user.setStatus(UserStatus.INACTIVE);
		user.setIsDelete(true);
		user.setUpdatedAt(now);
		userRepo.save(user);
	}

	@Override
	public PaginationResponse<?> getAllUserByRole(String roleId, int pageNo, int pageSize) {
		Role role = appCommon.checkRoleBelongToCurrentUser(roleId);

		Pageable pageable = PageRequest.of(pageNo, pageSize);
		Page<User> users = userRepo.findByRolesIdAndIsDeleteFalse(role.getId(), pageable);
		return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> getAllPendingRequest(int pageNo, int pageSize) {

		User admin = appCommon.currentLoginUser().getOwnerAdmin();
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
		User loginUser = appCommon.currentLoginUser();
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		if (loginUser.getOwnerAdmin() != null) {
			Page<User> users = userRepo.findByOwnerAdminAndStatusNotAndIsDeleteFalse(loginUser.getOwnerAdmin(),
					UserStatus.PENDING, pageable);
			return Mapper.toPaginationResponse(users.map(Mapper::toResponse));
		}

		return Mapper.toPaginationResponse(userRepo.findAllSuperAndSelfAdmins(pageable).map(Mapper::toResponse));

	}

	@Override
	public UserResponse getUserByEmail(String email) {

		User user = userRepo.findByEmail(email).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
		if (!user.getStatus().equals(UserStatus.ACTIVE)) {
			throw new ResourceNotFoundException("User is blocked");
		}
		return Mapper.toResponse(user);
	}

	@Override
	public UserResponse getUserById(String userId) {

		User user = userRepo.findById(userId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (!userId.equals(appCommon.currentLoginUser().getId())) {
			appCommon.validateUserManagementAccess(user);
		}

		return Mapper.toResponse(user);
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

}
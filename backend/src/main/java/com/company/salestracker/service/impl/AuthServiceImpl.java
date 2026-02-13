package com.company.salestracker.service.impl;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.LoginRequest;
import com.company.salestracker.dto.request.LogoutRequest;
import com.company.salestracker.dto.request.UserRequest;
import com.company.salestracker.dto.response.JwtResponse;
import com.company.salestracker.dto.response.OtpResponse;
import com.company.salestracker.dto.response.UserResponse;
import com.company.salestracker.entity.RefreshToken;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.RoleRepository;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.security.JwtTokenProvider;
import com.company.salestracker.service.AuthService;
import com.company.salestracker.service.RefreshTokenService;
import com.company.salestracker.util.AppConstant;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepo;
	private final BCryptPasswordEncoder encoder;
	private final RoleRepository roleRepo;
	private final RefreshTokenService refreshTokenService;
//	private final RedisService redisService;

	@Override
	public UserResponse createUser(UserRequest request) {

		Optional<User> emailUser = userRepo.findByEmail(request.getEmail());
		if (emailUser.isPresent() && !emailUser.get().getIsDelete())
			throw new BadRequestException(AppConstant.EMAIL_ALREADY_EXIST);

//		Optional<User> phoneUser = userRepo.findByPhone(request.getPhone());

//		if (emailUser.isPresent() && phoneUser.isPresent()) {
//
//			User emailMatch = emailUser.get();
//			User phoneMatch = phoneUser.get();
//
//			if (!emailMatch.getId().equals(phoneMatch.getId())) {
//				throw new BadRequestException("Email and phone belong to different users");
//			}
//		}
//		if (phoneUser.isPresent() && !phoneUser.get().getIsDelete())
//			throw new BadRequestException(AppConstant.PHONE_ALREADY_EXIST);

		User currentLoginUser = currentLoginUser();
		User ownerAdmin = currentLoginUser.getOwnerAdmin();

		Set<Role> roles = new HashSet<>(roleRepo.findAllById(request.getRoles()));
		boolean isOnlySuparAdminRole = isNewSuperAdmin(roles);

		roles.forEach(role -> {

			if (currentLoginUser.getOwnerAdmin() != null) {

				if (role.getOwnerAdmin() != null
						&& !role.getOwnerAdmin().getId().equals(currentLoginUser.getOwnerAdmin().getId())) {

					throw new BadRequestException(AppConstant.ROLES_INVALID);
				}
			} else {
				if (role.getOwnerAdmin() != null) {
					throw new BadRequestException(AppConstant.ROLES_INVALID);
				}
			}
		});

		User user = Mapper.toEntity(request, roles);
		user.setStatus(UserStatus.ACTIVE);
		if (ownerAdmin != null && !currentLoginUser.getId().equalsIgnoreCase(ownerAdmin.getId()))
			user.setStatus(UserStatus.PENDING);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		user.setPassword(encoder.encode(request.getPassword()));
		user.setCreatedBy(currentLoginUser);
//		Optional<User> deletedUser = emailUser.filter(User::getIsDelete).or(() -> phoneUser.filter(User::getIsDelete));
		Optional<User> deletedUser = emailUser.filter(User::getIsDelete);
		deletedUser.ifPresent(d -> {
			user.setId(d.getId());
			user.setIsDelete(false);
		});
		user.setOwnerAdmin(ownerAdmin);
		User savedUser = userRepo.save(user);
		if (ownerAdmin == null  && !isOnlySuparAdminRole) {
			savedUser.setOwnerAdmin(savedUser);
			savedUser = userRepo.save(savedUser);
		}

		return Mapper.toResponse(savedUser);
	}

	@Override
	@Transactional
	public JwtResponse loginUser(LoginRequest request) {

		User user = userRepo.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (user.getIsDelete())
			throw new ResourceNotFoundException(AppConstant.USER_NOT_FOUND);

		if (!encoder.matches(request.getPassword(), user.getPassword()))
			throw new BadRequestException(AppConstant.INVALID_CREDENTIAL);

		if (!user.getStatus().equals(UserStatus.ACTIVE))
			throw new BadRequestException(AppConstant.USER_IS_BLOCKED);

		String accessToken = jwtTokenProvider.generateToken(user);

		RefreshToken refreshToken = refreshTokenService.createToken(user);

		return JwtResponse.builder().accessToken(accessToken).refreshToken(refreshToken.getToken()).build();
	}

	private User currentLoginUser() {

		return userRepo.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
				.filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
	}

	@Override
	public OtpResponse forgotPassword(String email) {

		return null;
	}

	@Override
	@Transactional
	public JwtResponse refreshToken(String refreshToken) {
		RefreshToken oldToken = refreshTokenService.verifyToken(refreshToken);
		User user = oldToken.getUser();
		RefreshToken newRefreshToken = refreshTokenService.rotateToken(oldToken);
		String newAccessToken = jwtTokenProvider.generateToken(user);

		return JwtResponse.builder().accessToken(newAccessToken).refreshToken(newRefreshToken.getToken()).build();
	}

	@Override
	@Transactional
	public void logout(LogoutRequest request) {

//		redisService.set("blacklist:" + request.getAccessToken(),
//				jwtTokenProvider.getRemainingValidity(request.getAccessToken()));

		refreshTokenService.deleteRefreshToken(request.getRefreshToken());
	}

	private boolean isNewSuperAdmin(Set<Role> roles) {

		if (roles.size() >1)
			return false;
		if (roles.stream().filter(role -> role.getCreatedBy() == null).toList().isEmpty())
			return false;
		return true;
	}
}

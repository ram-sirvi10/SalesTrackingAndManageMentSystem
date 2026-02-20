package com.company.salestracker.service.impl;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.LoginRequest;
import com.company.salestracker.dto.request.LogoutRequest;
import com.company.salestracker.dto.request.OtpRequest;
import com.company.salestracker.dto.request.ResetPasswordRequest;
import com.company.salestracker.dto.request.UserRequest;
import com.company.salestracker.dto.response.JwtResponse;
import com.company.salestracker.dto.response.OtpResponse;
import com.company.salestracker.dto.response.UserResponse;
import com.company.salestracker.entity.Otp;
import com.company.salestracker.entity.OtpType;
import com.company.salestracker.entity.PasswordResetToken;
import com.company.salestracker.entity.RefreshToken;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.OtpRepository;
import com.company.salestracker.repository.PasswordResetTokenRepository;
import com.company.salestracker.repository.RoleRepository;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.security.JwtTokenProvider;
import com.company.salestracker.service.AuthService;
import com.company.salestracker.service.EmailService;
import com.company.salestracker.service.RefreshTokenService;
import com.company.salestracker.util.AppConstant;

import jakarta.mail.MessagingException;
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
	private final OtpRepository otpRepository;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final EmailService emailService;
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
		if (ownerAdmin == null && !isOnlySuparAdminRole) {
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

		String accessToken = jwtTokenProvider.generateAccessToken(user);

		RefreshToken refreshToken = refreshTokenService.createToken(user);

		return JwtResponse.builder().accessToken(accessToken).refreshToken(refreshToken.getToken()).build();
	}

	private User currentLoginUser() {

		return userRepo.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
				.filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
	}

	@Override
	@Transactional
	public JwtResponse refreshToken(String refreshToken) {
		RefreshToken oldToken = refreshTokenService.verifyToken(refreshToken);
		User user = oldToken.getUser();
		RefreshToken newRefreshToken = refreshTokenService.rotateToken(oldToken);
		String newAccessToken = jwtTokenProvider.generateAccessToken(user);

		return JwtResponse.builder().accessToken(newAccessToken).refreshToken(newRefreshToken.getToken()).build();
	}

	@Override
	@Transactional
	public void logout(LogoutRequest request) {

//		redisService.set("blacklist:" + request.getAccessToken(),
//				jwtTokenProvider.getRemainingValidity(request.getAccessToken()));

		refreshTokenService.deleteRefreshToken(request.getRefreshToken());
	}

	@Override
	@Transactional
	public void forgotPassword(String email) {

		Optional<User> optionalUser = userRepo.findByEmail(email);

		if (optionalUser.isEmpty() || optionalUser.get().getIsDelete()) {
			return;
		}

		User user = optionalUser.get();
		otpRepository.deleteByUser(user);
		String otpValue = genarateOtp();
		saveOtp(user, otpValue, OtpType.FORGOT_PASSWORD);
		try {
			emailService.sendHtml(email, "Otp for reset passowrd", otpValue);
		} catch (UnsupportedEncodingException e) {

			e.printStackTrace();
		} catch (MessagingException e) {

			e.printStackTrace();
		}
	}

	@Override
	@Transactional
	public OtpResponse verifyOtp(OtpRequest request) {

		User user = userRepo.findByEmail(request.getEmail())
				.orElseThrow(() -> new BadRequestException("Invalid request"));

		Otp otp = otpRepository.findTopByUserAndUsedFalseOrderByExpiryTimeDesc(user)
				.orElseThrow(() -> new BadRequestException("Invalid OTP"));

		if (otp.getExpiryTime().isBefore(LocalDateTime.now()))
			throw new BadRequestException("OTP expired");

		if (otp.getAttempts() >= 3)
			throw new BadRequestException("Too many attempts");

		if (!encoder.matches(request.getOtp(), otp.getOtpHash())) {
			otp.setAttempts(otp.getAttempts() + 1);
			otpRepository.save(otp);
			throw new BadRequestException("Invalid OTP");
		}

		otp.setUsed(true);
		passwordResetTokenRepository.deleteByUser(user);
		String resetToken = generateResetToken();
		PasswordResetToken token = PasswordResetToken.builder().token(resetToken).user(user)
				.expiryTime(LocalDateTime.now().plusMinutes(10)).used(false).build();

		passwordResetTokenRepository.save(token);

		return OtpResponse.builder().message("OTP verified successfully").resetToken(resetToken).build();
	}

	@Override
	@Transactional
	public void resetPassword(ResetPasswordRequest request) {

		PasswordResetToken token = passwordResetTokenRepository.findByTokenAndUsedFalse(request.getResetToken())
				.orElseThrow(() -> new BadRequestException("Invalid token"));

		if (token.getExpiryTime().isBefore(LocalDateTime.now()))
			throw new BadRequestException("Token expired");

		User user = token.getUser();

		user.setPassword(encoder.encode(request.getNewPassword()));
		user.setUpdatedAt(LocalDateTime.now());

		userRepo.save(user);

		token.setUsed(true);
		passwordResetTokenRepository.save(token);

		refreshTokenService.deleteByUser(user);
	}

	public String genarateOtp() {
		SecureRandom random = new SecureRandom();
		int otp = 100000 + random.nextInt(89999);
		return String.valueOf(otp);
	}

	public void saveOtp(User user, String otpValue, OtpType otpType) {
		String otpHash = encoder.encode(otpValue);
		Otp otp = Otp.builder().user(user).otpHash(otpHash).expiryTime(LocalDateTime.now().plusMinutes(5)).attempts(0)
				.used(false).otpType(otpType).build();
		otpRepository.save(otp);

	}

	private String generateResetToken() {
		String prefix = "RESET";
		String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
		return prefix + "-" + datePart + "-" + UUID.randomUUID().toString();
	}

	@Scheduled(cron = "0 0 * * * ?")
	@Transactional
	public void cleanupExpiredTokens() {

		otpRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
		passwordResetTokenRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
	}

	private boolean isNewSuperAdmin(Set<Role> roles) {

		if (roles.size() > 1)
			return false;
		if (roles.stream().filter(role -> role.getCreatedBy() == null).toList().isEmpty())
			return false;
		return true;
	}
}

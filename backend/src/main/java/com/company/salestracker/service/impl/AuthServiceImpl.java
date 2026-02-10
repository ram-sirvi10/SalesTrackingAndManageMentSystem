package com.company.salestracker.service.impl;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.LoginRequest;
import com.company.salestracker.dto.request.UserRequest;
import com.company.salestracker.dto.response.JwtResponse;
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

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

	private final AuthenticationManager authManager;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepo;
	private final BCryptPasswordEncoder encoder;
	private final RoleRepository roleRepo;
	private final RefreshTokenService refreshTokenService;

	@Override
	public UserResponse createUser(UserRequest request) {

	   
	    Optional<User> emailUser = userRepo.findByEmail(request.getEmail());
	    Optional<User> phoneUser = userRepo.findByPhone(request.getPhone());

	
	    if (emailUser.isPresent() && phoneUser.isPresent()) {

	        User emailMatch = emailUser.get();
	        User phoneMatch = phoneUser.get();

	        if (!emailMatch.getId().equals(phoneMatch.getId())) {
	            throw new BadRequestException(
	                    "Email and phone belong to different users");
	        }
	    }


	    if (emailUser.isPresent() && !emailUser.get().getIsDelete())
	        throw new BadRequestException(AppConstant.EMAIL_ALREADY_EXIST);

	    if (phoneUser.isPresent() && !phoneUser.get().getIsDelete())
	        throw new BadRequestException(AppConstant.PHONE_ALREADY_EXIST);

	
	    User currentLoginUser = currentLoginUser();
	    User ownerAdmin = currentLoginUser.getOwnerAdmin();

	    Set<Role> roles = new HashSet<>(roleRepo.findAllById(request.getRoles()));

	  
	    roles.forEach(role -> {

	        if (currentLoginUser.getOwnerAdmin() != null) {

	            if (role.getOwnerAdmin() != null &&
	                    !role.getOwnerAdmin().getId()
	                            .equals(currentLoginUser.getOwnerAdmin().getId())) {

	                throw new BadRequestException(AppConstant.ROLES_INVALID);
	            }
	        }
	    });

	  
	    User user = Mapper.toEntity(request, roles);

	    user.setStatus(UserStatus.ACTIVE);
	    user.setCreatedAt(LocalDateTime.now());
	    user.setUpdatedAt(LocalDateTime.now());
	    user.setPassword(encoder.encode(request.getPassword()));
	    user.setCreatedBy(currentLoginUser);

	   
	    Optional<User> deletedUser = emailUser
	            .filter(User::getIsDelete)
	            .or(() -> phoneUser.filter(User::getIsDelete));

	    deletedUser.ifPresent(d -> {
	        user.setId(d.getId());
	        user.setIsDelete(false);
	    });

	   
	    user.setOwnerAdmin(ownerAdmin);

	  
	    User savedUser = userRepo.save(user);

	  
	    if (ownerAdmin == null) {
	        savedUser.setOwnerAdmin(savedUser);
	        savedUser = userRepo.save(savedUser);
	    }

	   
	    return Mapper.toResponse(savedUser);
	}

	@Override
	public JwtResponse loginUser(LoginRequest request) {

		User user = userRepo.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));

		if (user.getIsDelete())
			throw new ResourceNotFoundException(AppConstant.USER_NOT_FOUND);

		if (!encoder.matches(request.getPassword(), user.getPassword()))
			throw new BadRequestException(AppConstant.INVALID_CREDENTIAL);

		if (user.getStatus().equals(UserStatus.INACTIVE))
			throw new BadRequestException(AppConstant.USER_IS_BLOCKED);

		Authentication authentication = authManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		String accessToken = jwtTokenProvider.generateToken(authentication);

		RefreshToken refreshToken = refreshTokenService.ganarateToken(user);

		return JwtResponse.builder().accessToken(accessToken).refreshToken(refreshToken.getToken()).build();
	}

	private User currentLoginUser() {

		return userRepo.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
				.filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
	}
}

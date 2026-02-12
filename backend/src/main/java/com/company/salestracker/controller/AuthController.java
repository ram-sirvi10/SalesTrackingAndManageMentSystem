package com.company.salestracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.LoginRequest;
import com.company.salestracker.dto.request.LogoutRequest;
import com.company.salestracker.dto.request.RefreshTokenRequest;
import com.company.salestracker.dto.request.UserRequest;
import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.dto.response.JwtResponse;
import com.company.salestracker.dto.response.OtpResponse;
import com.company.salestracker.dto.response.UserResponse;
import com.company.salestracker.service.AuthService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

	private final AuthService authService;

	// CREATE USER (Admin Only)
	@PostMapping("/adduser")
	@PreAuthorize("hasAuthority('CREATE_USER')")
	public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody UserRequest userRequest) {

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("User Registered Successfully", authService.createUser(userRequest)));
	}

	// LOGIN (Public)
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {

		return ResponseEntity.ok(ApiResponse.success("Login Successful", authService.loginUser(loginRequest)));
	}

	// FORGOT PASSWORD (Public)
	@PostMapping("/forgot-password")
	public ResponseEntity<ApiResponse<OtpResponse>> forgotPassword(@RequestParam String email) {

		return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", authService.forgotPassword(email)));
	}

	// REFRESH TOKEN (Public)
	@PostMapping("/refresh-token")
	public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {

		return ResponseEntity
				.ok(ApiResponse.success("Token refreshed", authService.refreshToken(request.getRefreshToken())));
	}

	// LOGOUT (Authenticated User)
	@PostMapping("/logout")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<ApiResponse<String>> logout(@Valid @RequestBody LogoutRequest request) {

		authService.logout(request);
		return ResponseEntity.ok(ApiResponse.success("Logout successful", "Logged out successfully"));
	}
}

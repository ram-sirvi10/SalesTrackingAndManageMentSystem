package com.company.salestracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.ForgotPasswordRequest;
import com.company.salestracker.dto.request.LoginRequest;
import com.company.salestracker.dto.request.LogoutRequest;
import com.company.salestracker.dto.request.OtpRequest;
import com.company.salestracker.dto.request.RefreshTokenRequest;
import com.company.salestracker.dto.request.ResetPasswordRequest;
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

	// ==============================
	// CREATE USER
	// ==============================

	@PostMapping("/adduser")
	@PreAuthorize("hasAuthority('CREATE_USER')")
	public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody UserRequest userRequest) {

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("User Registered Successfully", authService.createUser(userRequest)));
	}

	// ==============================
	// LOGIN
	// ==============================
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {

		return ResponseEntity.ok(ApiResponse.success("Login Successful", authService.loginUser(loginRequest)));
	}

	// ==============================
	// FORGOT PASSWORD
	// ==============================
	@PostMapping("/forgot-password")
	public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {

		authService.forgotPassword(request.getEmail());

		return ResponseEntity.ok(ApiResponse.success("If account exists, OTP sent", null));
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<ApiResponse<OtpResponse>> verifyOtp(
	        @Valid @RequestBody OtpRequest request) {

	    return ResponseEntity.ok(
	            ApiResponse.success("OTP verified",
	                    authService.verifyOtp(request)));
	}


	@PostMapping("/reset-password")
	public ResponseEntity<ApiResponse<String>> resetPassword(
	        @Valid @RequestBody ResetPasswordRequest request) {

	    authService.resetPassword(request);

	    return ResponseEntity.ok(
	            ApiResponse.success("Password reset successful", null));
	}

	// ==============================
	// REFRESH TOKEN
	// ==============================
	@PostMapping("/refresh-token")
	public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {

		return ResponseEntity
				.ok(ApiResponse.success("Token refreshed", authService.refreshToken(request.getRefreshToken())));
	}

	// ==============================
	// LOGOUT
	// ==============================
	@PostMapping("/logout")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<ApiResponse<String>> logout(@Valid @RequestBody LogoutRequest request) {

		authService.logout(request);
		return ResponseEntity.ok(ApiResponse.success("Logout successful", "Logged out successfully"));
	}
}

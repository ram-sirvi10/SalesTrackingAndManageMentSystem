package com.company.salestracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody UserRequest userRequest) {
	return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("User Ragister SuccessFull", authService.createUser(userRequest)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {
	return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("User Login SuccessFull", authService.loginUser(loginRequest)));

    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<OtpResponse>> forgotPassword(@RequestParam String email) {
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", authService.forgotPassword(email)));
    }

  

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", authService.refreshToken(request.getRefreshToken())));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(ApiResponse.success("Logout successful", "Logged out successfully"));
    }

}
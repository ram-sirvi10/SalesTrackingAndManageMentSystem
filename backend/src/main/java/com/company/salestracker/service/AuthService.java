package com.company.salestracker.service;

import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.LoginRequest;
import com.company.salestracker.dto.request.LogoutRequest;
import com.company.salestracker.dto.request.UserRequest;
import com.company.salestracker.dto.response.JwtResponse;
import com.company.salestracker.dto.response.OtpResponse;
import com.company.salestracker.dto.response.UserResponse;

@Service
public interface AuthService {
	public UserResponse createUser(UserRequest request);

	public JwtResponse loginUser(LoginRequest request);

	public OtpResponse forgotPassword(String email);

	public JwtResponse refreshToken(String refreshToken);


	void logout(LogoutRequest request);
}

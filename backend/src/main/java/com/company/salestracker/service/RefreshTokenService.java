package com.company.salestracker.service;

import com.company.salestracker.entity.RefreshToken;
import com.company.salestracker.entity.User;

public interface RefreshTokenService {

	public RefreshToken ganarateToken(User user);

	public boolean isValidToken(String token, User user);

}

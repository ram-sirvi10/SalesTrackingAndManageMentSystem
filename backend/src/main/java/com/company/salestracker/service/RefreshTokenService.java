package com.company.salestracker.service;

import com.company.salestracker.entity.RefreshToken;
import com.company.salestracker.entity.User;

public interface RefreshTokenService {

	RefreshToken rotateToken(RefreshToken oldToken);

	RefreshToken verifyToken(String token);

	RefreshToken createToken(User user);

	void deleteByUser(User user);

	void deleteRefreshToken(String refreshToken);

}

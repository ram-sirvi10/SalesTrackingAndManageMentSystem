package com.company.salestracker.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.company.salestracker.entity.RefreshToken;
import com.company.salestracker.entity.User;
import com.company.salestracker.exception.UnauthorizedException;
import com.company.salestracker.repository.RefreshTokenRepository;
import com.company.salestracker.service.RefreshTokenService;
import com.company.salestracker.util.AppConstant;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

	@Value("${refreshtoken.expriration}")
	private int expirationDays;
	private RefreshTokenRepository refreshTokenRepo;

	@Override
	public RefreshToken ganarateToken(User user) {

		refreshTokenRepo.deleteByUserAndIsUsed(user, true);

		return refreshTokenRepo.save(RefreshToken.builder().user(user).token(UUID.randomUUID().toString())
				.expirationTime(LocalDateTime.now().plusDays(expirationDays)).build());
	}

	@Override
	public boolean isValidToken(String token, User user) {
		RefreshToken refreshToken = refreshTokenRepo.findByUserAndTokenAndIsUsed(user, token, false)
				.orElseThrow(() -> new UnauthorizedException(AppConstant.INAVLID_REFRESH_TOKEN));
		if (refreshToken.getExpirationTime().isBefore(LocalDateTime.now())) {
			throw new UnauthorizedException(AppConstant.TOKEN_EXPIRE);
		}

		return true;
	}
	
	

}

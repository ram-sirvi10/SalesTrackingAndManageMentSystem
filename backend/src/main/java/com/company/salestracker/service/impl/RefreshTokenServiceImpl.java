package com.company.salestracker.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.company.salestracker.entity.RefreshToken;
import com.company.salestracker.entity.User;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.repository.RefreshTokenRepository;
import com.company.salestracker.service.RefreshTokenService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

	@Value("${refreshtoken.expriration}")
	private int REFRESH_TOKEN_EXPIRY;

	private final RefreshTokenRepository repository;

	@Override
	public RefreshToken createToken(User user) {

		repository.deleteByUser(user);

		RefreshToken refreshToken = RefreshToken.builder().token(UUID.randomUUID().toString()).user(user)
				.expirationTime(LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY)).isUsed(false).build();

		return repository.save(refreshToken);
	}

	@Override
	public RefreshToken verifyToken(String token) {

		RefreshToken refreshToken = repository.findByToken(token)
				.orElseThrow(() -> new BadRequestException("Invalid Refresh Token"));

		if (Boolean.TRUE.equals(refreshToken.getIsUsed())) {
			throw new BadRequestException("Refresh Token already used");
		}

		if (refreshToken.getExpirationTime().isBefore(LocalDateTime.now())) {
			throw new BadRequestException("Refresh Token expired");
		}

		return refreshToken;
	}

	@Override
	@Transactional
	public RefreshToken rotateToken(RefreshToken oldToken) {

		oldToken.setIsUsed(true);
		repository.save(oldToken);

		return createToken(oldToken.getUser());
	}

	@Override
	public void deleteRefreshToken(String refreshToken) {
		RefreshToken token = repository.findByToken(refreshToken)
				.orElseThrow(() -> new RuntimeException("Invalid Refresh Token"));
		repository.delete(token);
	}

	@Override
	public void deleteByUser(User user) {
		repository.deleteByUser(user);
	}
}

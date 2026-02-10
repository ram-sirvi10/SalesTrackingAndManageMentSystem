package com.company.salestracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.company.salestracker.entity.RefreshToken;
import com.company.salestracker.entity.User;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
	void deleteByUserAndIsUsed(User user, Boolean isUsed);

	Optional<RefreshToken> findByUserAndTokenAndIsUsed(User user, String token, Boolean isUsed);

	Optional<RefreshToken> findByUserAndToken(User user, String token);
}

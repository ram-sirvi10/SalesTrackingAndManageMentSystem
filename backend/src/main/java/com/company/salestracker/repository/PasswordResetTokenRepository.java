package com.company.salestracker.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.salestracker.entity.PasswordResetToken;
import com.company.salestracker.entity.User;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

	Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);

	void deleteByUser(User user);

	void deleteByExpiryTimeBefore(LocalDateTime time);
}

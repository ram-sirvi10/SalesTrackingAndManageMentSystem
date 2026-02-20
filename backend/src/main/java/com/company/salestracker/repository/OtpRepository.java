package com.company.salestracker.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.salestracker.entity.Otp;
import com.company.salestracker.entity.User;

@Repository
public interface OtpRepository extends JpaRepository<Otp, String> {

	Optional<Otp> findTopByUserAndUsedFalseOrderByExpiryTimeDesc(User user);

	void deleteByUser(User user);

	void deleteByExpiryTimeBefore(LocalDateTime time);
}

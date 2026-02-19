package com.company.salestracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.company.salestracker.entity.Target;
import com.company.salestracker.entity.User;

public interface TargetRepository extends JpaRepository<Target, String> {

	boolean existsByUserAndTargetMonthAndTargetYearAndIsDeleteFalse(User user, Integer month, Integer year);

	Optional<Target> findByUserAndTargetMonthAndTargetYearAndIsDeleteFalse(User user, Integer month, Integer year);

	Page<Target> findByOwnerAdminAndIsDeleteFalse(User ownerAdmin, Pageable pageable);

	Page<Target> findByUserAndIsDeleteFalse(User user, Pageable pageable);

	Optional<Target> findByIdAndIsDeleteFalse(String id);

	List<Target> findByOwnerAdminAndTargetMonthAndTargetYearAndIsDeleteFalse(User ownerAdmin, Integer month,
			Integer year);
}

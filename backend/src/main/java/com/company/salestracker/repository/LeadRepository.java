package com.company.salestracker.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.company.salestracker.entity.Lead;
import com.company.salestracker.entity.LeadStatus;
import com.company.salestracker.entity.User;

public interface LeadRepository extends JpaRepository<Lead, String> {

	
	Page<Lead> findByOwnerAdminAndIsDeleteFalse(User ownerAdmin, Pageable pageable);

	
	Page<Lead> findByAssignedtoAndIsDeleteFalse(User user, Pageable pageable);

	
	Optional<Lead> findByIdAndIsDeleteFalse(String id);

	
	Page<Lead> findByOwnerAdminAndStatusAndIsDeleteFalse(User ownerAdmin, LeadStatus status, Pageable pageable);

	@Query("""
		    SELECT COUNT(l)
		    FROM Lead l
		    WHERE l.ownerAdmin = :ownerAdmin
		    AND l.isDelete = false
		    AND l.createdAt BETWEEN :startDate AND :endDate
		""")
		Long countLeadsBetweenDates(
		        User ownerAdmin,
		        LocalDateTime startDate,
		        LocalDateTime endDate
		);

}

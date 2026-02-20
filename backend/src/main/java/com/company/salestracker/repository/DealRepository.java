
package com.company.salestracker.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.company.salestracker.entity.Deal;
import com.company.salestracker.entity.User;

public interface DealRepository extends JpaRepository<Deal, String> {

	Page<Deal> findByOwnerAdminAndIsDeleteFalse(User ownerAdmin, Pageable pageable);

	Page<Deal> findByCreatedByAndIsDeleteFalse(User user, Pageable pageable);

	@Query("""
			    SELECT COUNT(d)
			    FROM Deal d
			    WHERE d.ownerAdmin = :ownerAdmin
			    AND d.isDelete = false
			    AND d.createdAt BETWEEN :startDate AND :endDate
			""")
	Long countDealsBetweenDates(User ownerAdmin, LocalDateTime startDate, LocalDateTime endDate);

	@Query("""
			    SELECT COUNT(d)
			    FROM Deal d
			    WHERE d.ownerAdmin = :ownerAdmin
			    AND d.dealStage = 'CLOSED_LOST'
			    AND d.isDelete = false
			    AND d.closingDate BETWEEN :startDate AND :endDate
			""")
	Long countLostDeals(User ownerAdmin, LocalDate startDate, LocalDate endDate);

	@Query("""
			    SELECT COALESCE(SUM(d.expectedAmount),0)
			    FROM Deal d
			    WHERE d.ownerAdmin = :ownerAdmin
			    AND d.dealStage = 'CLOSED_LOST'
			    AND d.isDelete = false
			    AND d.closingDate BETWEEN :startDate AND :endDate
			""")
	BigDecimal sumLostAmount(User ownerAdmin, LocalDate startDate, LocalDate endDate);

}

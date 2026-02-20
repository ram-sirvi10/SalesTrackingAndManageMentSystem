package com.company.salestracker.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.company.salestracker.dto.response.SalesSummaryResponse;
import com.company.salestracker.entity.Deal;
import com.company.salestracker.entity.Sale;
import com.company.salestracker.entity.User;

import io.lettuce.core.dynamic.annotation.Param;

public interface SalesRepository extends JpaRepository<Sale, String> {
	Page<Sale> findByOwnerAdminAndIsDeleteFalse(User ownerAdmin, Pageable pageable);

	Page<Sale> findByCommissionUserAndIsDeleteFalse(User commisionUser, Pageable pageable);

	boolean existsByDealAndIsDeleteFalse(Deal deal);

	@Query("""
			    SELECT new com.company.salestracker.dto.response.SalesSummaryResponse(
			        YEAR(s.saleDate),
			        NULL,
			        SUM(s.saleAmount),
			        SUM(CASE WHEN s.paymentStatus = 'PAID' THEN s.saleAmount ELSE 0 END),
			        SUM(CASE WHEN s.paymentStatus = 'PENDING' THEN s.saleAmount ELSE 0 END),
			        COUNT(s)
			    )
			    FROM Sale s
			    WHERE s.ownerAdmin = :ownerAdmin
			      AND s.isDelete = false
			    GROUP BY YEAR(s.saleDate)
			    ORDER BY YEAR(s.saleDate) DESC
			""")
	List<SalesSummaryResponse> getYearlySalesSummary(@Param("ownerAdmin") User ownerAdmin);

	@Query("""
			    SELECT new com.company.salestracker.dto.response.SalesSummaryResponse(
			        YEAR(s.saleDate),
			        MONTH(s.saleDate),
			        SUM(s.saleAmount),
			        SUM(CASE WHEN s.paymentStatus = 'PAID' THEN s.saleAmount ELSE 0 END),
			        SUM(CASE WHEN s.paymentStatus = 'PENDING' THEN s.saleAmount ELSE 0 END),
			        COUNT(s)
			    )
			    FROM Sale s
			    WHERE s.ownerAdmin = :ownerAdmin
			      AND s.isDelete = false
			      AND YEAR(s.saleDate) = :year
			    GROUP BY YEAR(s.saleDate), MONTH(s.saleDate)
			    ORDER BY MONTH(s.saleDate) ASC
			""")
	List<SalesSummaryResponse> getMonthlySalesSummaryByYear(@Param("ownerAdmin") User ownerAdmin,
			@Param("year") int year);

	@Query("""
			SELECT s.commissionUser.id, COALESCE(SUM(s.saleAmount),0)
			FROM Sale s
			WHERE s.commissionUser.id IN :userIds
			AND s.saleDate BETWEEN :startDate AND :endDate
			AND s.isDelete = false
			GROUP BY s.commissionUser.id
			""")
	List<Object[]> getTotalSalesGroupedByUsers(@Param("userIds") List<String> userIds,
			@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	@Query("""
			    SELECT s.commissionUser.id,
			           s.commissionUser.name,
			           COALESCE(SUM(s.saleAmount),0),
			           COUNT(s)
			    FROM Sale s
			    WHERE s.ownerAdmin = :ownerAdmin
			    AND s.isDelete = false
			    AND s.saleDate BETWEEN :startDate AND :endDate
			    GROUP BY s.commissionUser.id, s.commissionUser.name
			""")
	List<Object[]> getSalesByUser(User ownerAdmin, LocalDate startDate, LocalDate endDate);

	@Query("""
			    SELECT COALESCE(SUM(s.saleAmount),0)
			    FROM Sale s
			    WHERE s.ownerAdmin = :ownerAdmin
			    AND s.isDelete = false
			    AND s.saleDate BETWEEN :startDate AND :endDate
			""")
	BigDecimal getTotalRevenue(User ownerAdmin, LocalDate startDate, LocalDate endDate);

	@Query("""
			    SELECT COALESCE(SUM(s.saleAmount),0)
			    FROM Sale s
			    WHERE s.ownerAdmin = :ownerAdmin
			    AND s.isDelete = false
			    AND s.paymentStatus = 'PAID'
			    AND s.saleDate BETWEEN :startDate AND :endDate
			""")
	BigDecimal getPaidRevenue(User ownerAdmin, LocalDate startDate, LocalDate endDate);

	@Query("""
			    SELECT COALESCE(SUM(s.saleAmount),0)
			    FROM Sale s
			    WHERE s.ownerAdmin = :ownerAdmin
			    AND s.isDelete = false
			    AND s.paymentStatus = 'PENDING'
			    AND s.saleDate BETWEEN :startDate AND :endDate
			""")
	BigDecimal getPendingRevenue(User ownerAdmin, LocalDate startDate, LocalDate endDate);

	@Query("""
			    SELECT MONTH(s.saleDate),
			           COALESCE(SUM(s.saleAmount),0)
			    FROM Sale s
			    WHERE s.ownerAdmin = :ownerAdmin
			    AND s.isDelete = false
			    AND s.saleDate BETWEEN :startDate AND :endDate
			    GROUP BY MONTH(s.saleDate)
			    ORDER BY MONTH(s.saleDate)
			""")
	List<Object[]> getSalesByMonth(@Param("ownerAdmin") User ownerAdmin, @Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);

}

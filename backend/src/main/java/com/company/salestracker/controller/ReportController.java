package com.company.salestracker.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.ReportFilter;
import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.dto.response.ReportResponse;
import com.company.salestracker.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

	private final ReportService reportService;

	// ==============================
	// SALES BY USER
	// ==============================
	@GetMapping("/sales-by-user")
	@PreAuthorize("hasAuthority('VIEW_SALES_REPORT')")
	public ResponseEntity<ApiResponse<ReportResponse>> salesByUser(@RequestParam LocalDate startDate,
			@RequestParam LocalDate endDate) {

		ReportResponse response = reportService.getSalesByUser(new ReportFilter(startDate, endDate));

		return ResponseEntity.ok(ApiResponse.success("Sales by user report fetched successfully", response));
	}

	// ==============================
	// SALES BY PERIOD
	// ==============================
	@GetMapping("/sales-by-period")
	@PreAuthorize("hasAuthority('VIEW_SALES_REPORT')")
	public ResponseEntity<ApiResponse<ReportResponse>> salesByPeriod(@RequestParam LocalDate startDate,
			@RequestParam LocalDate endDate) {

		ReportResponse response = reportService.getSalesByPeriod(new ReportFilter(startDate, endDate));

		return ResponseEntity.ok(ApiResponse.success("Sales by period report fetched successfully", response));
	}

	// ==============================
	// LEAD TO DEAL CONVERSION
	// ==============================
	@GetMapping("/conversion")
	@PreAuthorize("hasAuthority('VIEW_CONVERSION_REPORT')")
	public ResponseEntity<ApiResponse<ReportResponse>> conversion(@RequestParam LocalDate startDate,
			@RequestParam LocalDate endDate) {

		ReportResponse response = reportService.getConversion(new ReportFilter(startDate, endDate));

		return ResponseEntity.ok(ApiResponse.success("Lead to deal conversion report fetched successfully", response));
	}

	// ==============================
	// LOST DEAL ANALYSIS
	// ==============================
	@GetMapping("/lost-deals")
	@PreAuthorize("hasAuthority('VIEW_LOST_DEAL_REPORT')")
	public ResponseEntity<ApiResponse<ReportResponse>> lostDeals(@RequestParam LocalDate startDate,
			@RequestParam LocalDate endDate) {

		ReportResponse response = reportService.getLostDealReport(new ReportFilter(startDate, endDate));

		return ResponseEntity.ok(ApiResponse.success("Lost deal analysis report fetched successfully", response));
	}

	// ==============================
	// DASHBOARD REPORT
	// ==============================
	@GetMapping("/dashboard")
	@PreAuthorize("hasAuthority('VIEW_DASHBOARD_REPORT')")
	public ResponseEntity<ApiResponse<ReportResponse>> dashboard(@RequestParam LocalDate startDate,
			@RequestParam LocalDate endDate) {

		ReportResponse response = reportService.getDashboardReport(new ReportFilter(startDate, endDate));

		return ResponseEntity.ok(ApiResponse.success("Dashboard report fetched successfully", response));
	}
}

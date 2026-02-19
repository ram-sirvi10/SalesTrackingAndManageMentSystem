package com.company.salestracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.company.salestracker.dto.request.DealAssignRequest;
import com.company.salestracker.dto.request.DealRequest;
import com.company.salestracker.dto.request.DealStageUpdateRequest;
import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.dto.response.DealResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.service.DealService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {
	private final DealService dealService;

	// ==============================
	// CREATE DEAL
	// ==============================
	@PostMapping
	@PreAuthorize("hasAuthority('CREATE_DEAL')")
	public ResponseEntity<ApiResponse<DealResponse>> createDeal(@Valid @RequestBody DealRequest request) {

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Lead created successfully", dealService.createDeal(request)));
	}

	// ==============================
	// UPDATE DEAL
	// ==============================
	@PutMapping("/{dealId}")
	@PreAuthorize("hasAuthority('UPDATE_DEAL')")
	public ResponseEntity<ApiResponse<DealResponse>> updateDeal(@Valid @RequestBody DealRequest request,
			@PathVariable String dealId) {

		return ResponseEntity.status(HttpStatus.OK)
				.body(ApiResponse.success("Lead created successfully", dealService.updateDeal(dealId, request)));
	}

	// ==============================
	// ASSIGN DEAL
	// ==============================
	@PatchMapping("/assign")
	@PreAuthorize("hasAuthority('ASSIGN_DEAL')")
	public ResponseEntity<ApiResponse<DealResponse>> assignLead(@Valid @RequestBody DealAssignRequest request) {

		return ResponseEntity.ok(ApiResponse.success("Deal assigned successfully", dealService.assignDeal(request)));
	}

	// ==============================
	// UPDATE STATUS
	// ==============================
	@PatchMapping("/stage")
	@PreAuthorize("hasAuthority('UPDATE_DEAL_STAGE')")
	public ResponseEntity<ApiResponse<DealResponse>> updateStatus(@Valid @RequestBody DealStageUpdateRequest request) {

		return ResponseEntity
				.ok(ApiResponse.success("Deat stage updated successfully", dealService.updateStage(request)));
	}

	// ==============================
	// DELETE DEAL
	// ==============================
	@DeleteMapping("/{dealId}")
	@PreAuthorize("hasAuthority('DELETE_DEAL')")
	public ResponseEntity<ApiResponse<?>> deleteLead(@PathVariable String dealId) {

		dealService.deleteDeal(dealId);

		return ResponseEntity.ok(ApiResponse.success("Deal deleted successfully"));
	}

	// ==============================
	// GET DEAL BY ID
	// ==============================
	@GetMapping("/{dealId}")
	@PreAuthorize("hasAuthority('GET_DEAL_BY_ID')")
	public ResponseEntity<ApiResponse<?>> getLeadById(@PathVariable String dealId) {

		return ResponseEntity.ok(ApiResponse.success("Lead fetched successfully", dealService.getById(dealId)));

	}

	// ==============================
	// VIEW ALL DEALS
	// ==============================
	@GetMapping
	@PreAuthorize("hasAuthority('VIEW_ALL_DEALS')")
	public ResponseEntity<ApiResponse<PaginationResponse<?>>> viewAllLeads(@RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity
				.ok(ApiResponse.success("Deals fetched successfully", dealService.viewAllDeals(pageNo, pageSize)));
	}

	// ==============================
	// VIEW DEALS BY ASSIGNED USER
	// ==============================
	@GetMapping("/assigned/{userId}")
	@PreAuthorize("hasAuthority('VIEW_ASSIGNED_DEALS_BY_USER')")
	public ResponseEntity<ApiResponse<PaginationResponse<?>>> viewLeadsByAssignedUser(@PathVariable String userId,
			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity.ok(ApiResponse.success("Assigned Deals to this user fetched successfully",
				dealService.viewDealsByAssignedUser(userId, pageNo, pageSize)));
	}

}

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

import com.company.salestracker.dto.request.LeadAssignRequest;
import com.company.salestracker.dto.request.LeadRequest;
import com.company.salestracker.dto.request.LeadStatusUpdateRequest;
import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.dto.response.LeadResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.service.LeadService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

	private final LeadService leadService;

	// ==============================
	// CREATE LEAD
	// ==============================
	@PostMapping
	@PreAuthorize("hasAuthority('CREATE_LEAD')")
	public ResponseEntity<ApiResponse<LeadResponse>> createLead(@Valid @RequestBody LeadRequest request) {

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Lead created successfully", leadService.createLead(request)));
	}

	// ==============================
	// UPDATE LEAD
	// ==============================
	@PutMapping("/{leadId}")
	@PreAuthorize("hasAuthority('UPDATE_LEAD')")
	public ResponseEntity<ApiResponse<LeadResponse>> updateLead(@PathVariable String leadId,
			@Valid @RequestBody LeadRequest request) {

		return ResponseEntity
				.ok(ApiResponse.success("Lead updated successfully", leadService.updateLead(leadId, request)));
	}

	// ==============================
	// ASSIGN LEAD
	// ==============================
	@PatchMapping("/assign")
	@PreAuthorize("hasAuthority('ASSIGN_LEAD')")
	public ResponseEntity<ApiResponse<LeadResponse>> assignLead(@Valid @RequestBody LeadAssignRequest request) {

		return ResponseEntity.ok(ApiResponse.success("Lead assigned successfully", leadService.assignLead(request)));
	}

	// ==============================
	// UPDATE STATUS
	// ==============================
	@PatchMapping("/status")
	@PreAuthorize("hasAuthority('UPDATE_LEAD_STATUS')")
	public ResponseEntity<ApiResponse<LeadResponse>> updateStatus(@Valid @RequestBody LeadStatusUpdateRequest request) {

		return ResponseEntity
				.ok(ApiResponse.success("Lead status updated successfully", leadService.updateStatus(request)));
	}

	// ==============================
	// DELETE LEAD
	// ==============================
	@DeleteMapping("/{leadId}")
	@PreAuthorize("hasAuthority('DELETE_LEAD')")
	public ResponseEntity<ApiResponse<?>> deleteLead(@PathVariable String leadId) {

		leadService.deleteLead(leadId);

		return ResponseEntity.ok(ApiResponse.success("Lead deleted successfully"));
	}

	// ==============================
	// GET LEAD BY ID
	// ==============================
	@GetMapping("/{leadId}")
	@PreAuthorize("hasAuthority('GET_LEAD')")
	public ResponseEntity<ApiResponse<?>> getLeadById(@PathVariable String leadId) {

		return ResponseEntity.ok(ApiResponse.success("Lead fetched successfully", leadService.getById(leadId)));

	}

	// ==============================
	// VIEW ALL LEADS 
	// ==============================
	@GetMapping
	@PreAuthorize("hasAuthority('VIEW_ALL_LEADS')")
	public ResponseEntity<ApiResponse<PaginationResponse<?>>> viewAllLeads(@RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity
				.ok(ApiResponse.success("Leads fetched successfully", leadService.viewAllLead(pageNo, pageSize)));
	}

	// ==============================
	// VIEW LEADS BY ASSIGNED USER
	// ==============================
	@GetMapping("/assigned/{userId}")
	@PreAuthorize("hasAuthority('VIEW_ASSIGNED_LEADS')")
	public ResponseEntity<ApiResponse<PaginationResponse<?>>> viewLeadsByAssignedUser(@PathVariable String userId,
			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity.ok(ApiResponse.success("Assigned leads fetched successfully",
				leadService.viewAllLeadByAssignedUser(userId, pageNo, pageSize)));
	}
}

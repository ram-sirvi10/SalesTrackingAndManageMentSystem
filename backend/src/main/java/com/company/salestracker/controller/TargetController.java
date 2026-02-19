package com.company.salestracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.TargetRequest;
import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.TargetResponse;
import com.company.salestracker.service.TargetService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/targets")
@RequiredArgsConstructor
public class TargetController {

	private final TargetService targetService;

	// ==============================
	// CREATE TARGET
	// ==============================
	@PostMapping
	@PreAuthorize("hasAuthority('CREATE_TARGET')")
	public ResponseEntity<ApiResponse<TargetResponse>> createTarget(@Valid @RequestBody TargetRequest request) {

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Target created successfully", targetService.createTarget(request)));
	}

	// ==============================
	// UPDATE TARGET
	// ==============================
	@PutMapping("/{targetId}")
	@PreAuthorize("hasAuthority('UPDATE_TARGET')")
	public ResponseEntity<ApiResponse<TargetResponse>> updateTarget(@PathVariable String targetId,
			@Valid @RequestBody TargetRequest request) {

		return ResponseEntity
				.ok(ApiResponse.success("Target updated successfully", targetService.updateTarget(targetId, request)));
	}

	// ==============================
	// DELETE TARGET
	// ==============================
	@DeleteMapping("/{targetId}")
	@PreAuthorize("hasAuthority('DELETE_TARGET')")
	public ResponseEntity<ApiResponse<?>> deleteTarget(@PathVariable String targetId) {

		targetService.deleteTarget(targetId);

		return ResponseEntity.ok(ApiResponse.success("Target deleted successfully"));
	}

	// ==============================
	// GET TARGET BY ID
	// ==============================
	@GetMapping("/{targetId}")
	@PreAuthorize("hasAuthority('GET_TARGET_BY_ID')")
	public ResponseEntity<ApiResponse<TargetResponse>> getTargetById(@PathVariable String targetId) {

		return ResponseEntity
				.ok(ApiResponse.success("Target fetched successfully", targetService.getTargetById(targetId)));
	}

	// ==============================
	// VIEW ALL TARGETS
	// ==============================
	@GetMapping
	@PreAuthorize("hasAuthority('VIEW_ALL_TARGETS')")
	public ResponseEntity<ApiResponse<PaginationResponse<TargetResponse>>> viewAllTargets(
			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity
				.ok(ApiResponse.success("Targets fetched successfully", targetService.getAllTargets(pageNo, pageSize)));
	}

	// ==============================
	// VIEW TARGETS BY USER
	// ==============================
	@GetMapping("/user/{userId}")
	@PreAuthorize("hasAuthority('VIEW_TARGETS_BY_USER')")
	public ResponseEntity<ApiResponse<PaginationResponse<TargetResponse>>> viewTargetsByUser(
			@PathVariable String userId, @RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize) {

		return ResponseEntity.ok(ApiResponse.success("User targets fetched successfully",
				targetService.getTargetsByUser(userId, pageNo, pageSize)));
	}

	// ==============================
	// TEAM PERFORMANCE
	// ==============================
	@GetMapping("/performance/team")
	@PreAuthorize("hasAuthority('VIEW_TEAM_TARGET_PERFORMANCE')")
	public ResponseEntity<ApiResponse<List<TargetResponse>>> getTeamPerformance(@RequestParam Integer month,
			@RequestParam Integer year) {

		return ResponseEntity.ok(ApiResponse.success("Team performance fetched successfully",
				targetService.getTeamPerformance(month, year)));
	}

	// ==============================
	// USER PERFORMANCE
	// ==============================
	@GetMapping("/performance/user/{userId}")
	@PreAuthorize("hasAuthority('VIEW_USER_TARGET_PERFORMANCE')")
	public ResponseEntity<ApiResponse<TargetResponse>> getUserPerformance(@PathVariable String userId,
			@RequestParam Integer month, @RequestParam Integer year) {

		return ResponseEntity.ok(ApiResponse.success("User performance fetched successfully",
				targetService.getUserPerformance(userId, month, year)));
	}
}

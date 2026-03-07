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
    @PreAuthorize("hasAuthority('DEAL_CREATE')")
    public ResponseEntity<ApiResponse<DealResponse>> createDeal(@Valid @RequestBody DealRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Deal created successfully",
                        dealService.createDeal(request)));
    }

    // ==============================
    // UPDATE DEAL
    // ==============================
    @PutMapping("/{dealId}")
    @PreAuthorize("hasAuthority('DEAL_UPDATE')")
    public ResponseEntity<ApiResponse<DealResponse>> updateDeal(
            @Valid @RequestBody DealRequest request,
            @PathVariable String dealId) {

        return ResponseEntity.ok(
                ApiResponse.success("Deal updated successfully",
                        dealService.updateDeal(dealId, request)));
    }

    // ==============================
    // ASSIGN DEAL
    // ==============================
    @PatchMapping("/assign")
    @PreAuthorize("hasAuthority('DEAL_ASSIGN')")
    public ResponseEntity<ApiResponse<DealResponse>> assignDeal(
            @Valid @RequestBody DealAssignRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Deal assigned successfully",
                        dealService.assignDeal(request)));
    }

    // ==============================
    // UPDATE DEAL STAGE
    // ==============================
    @PatchMapping("/stage")
    @PreAuthorize("hasAuthority('DEAL_STAGE_UPDATE')")
    public ResponseEntity<ApiResponse<DealResponse>> updateStage(
            @Valid @RequestBody DealStageUpdateRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Deal stage updated successfully",
                        dealService.updateStage(request)));
    }

    // ==============================
    // DELETE DEAL
    // ==============================
    @DeleteMapping("/{dealId}")
    @PreAuthorize("hasAuthority('DEAL_DELETE')")
    public ResponseEntity<ApiResponse<?>> deleteDeal(@PathVariable String dealId) {

        dealService.deleteDeal(dealId);

        return ResponseEntity.ok(
                ApiResponse.success("Deal deleted successfully"));
    }

    // ==============================
    // GET DEAL BY ID
    // ==============================
    @GetMapping("/{dealId}")
    @PreAuthorize("hasAuthority('DEAL_VIEW')")
    public ResponseEntity<ApiResponse<?>> getDealById(@PathVariable String dealId) {

        return ResponseEntity.ok(
                ApiResponse.success("Deal fetched successfully",
                        dealService.getById(dealId)));
    }

    // ==============================
    // VIEW ALL DEALS
    // ==============================
    @GetMapping
    @PreAuthorize("hasAuthority('DEAL_VIEW_ALL')")
    public ResponseEntity<ApiResponse<PaginationResponse<?>>> viewAllDeals(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        return ResponseEntity.ok(
                ApiResponse.success("Deals fetched successfully",
                        dealService.viewAllDeals(pageNo, pageSize)));
    }

    // ==============================
    // VIEW DEALS BY ASSIGNED USER
    // ==============================
    @GetMapping("/assigned/{userId}")
    @PreAuthorize("hasAuthority('DEAL_VIEW') or #userId == authentication.principal.id")
    public ResponseEntity<ApiResponse<PaginationResponse<?>>> viewDealsByAssignedUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        return ResponseEntity.ok(
                ApiResponse.success("Assigned deals fetched successfully",
                        dealService.viewDealsByAssignedUser(userId, pageNo, pageSize)));
    }
}
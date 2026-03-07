package com.company.salestracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.salestracker.dto.request.PaymentStatusUpdateRequest;
import com.company.salestracker.dto.request.SaleRequest;
import com.company.salestracker.dto.response.ApiResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.SaleResponse;
import com.company.salestracker.service.SalesService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService salesService;

    // ==============================
    // CREATE SALE
    // ==============================
    @PostMapping
    public ResponseEntity<ApiResponse<SaleResponse>> createSale(@Valid @RequestBody SaleRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Sale created successfully",
                        salesService.createSale(request)
                ));
    }

    // ==============================
    // UPDATE PAYMENT STATUS
    // ==============================
    @PatchMapping("/payment-status")
    @PreAuthorize("hasAuthority('SALE_PAYMENT_UPDATE')")
    public ResponseEntity<ApiResponse<SaleResponse>> updatePaymentStatus(
            @Valid @RequestBody PaymentStatusUpdateRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment status updated successfully",
                        salesService.updatePaymentStatus(request)
                ));
    }

    // ==============================
    // GET SALE BY ID
    // ==============================
    @GetMapping("/{saleId}")
    @PreAuthorize("hasAuthority('SALE_VIEW')")
    public ResponseEntity<ApiResponse<?>> getSaleById(@PathVariable String saleId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Sale fetched successfully",
                        salesService.getSaleById(saleId)
                )
        );
    }

    // ==============================
    // VIEW ALL SALES
    // ==============================
    @GetMapping
    @PreAuthorize("hasAuthority('SALE_VIEW_ALL')")
    public ResponseEntity<ApiResponse<PaginationResponse<?>>> viewAllSales(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Sales fetched successfully",
                        salesService.getAllSales(pageNo, pageSize)
                )
        );
    }

    // ==============================
    // VIEW SALES BY COMMISSION USER
    // ==============================
    @GetMapping("/commission/{userId}")
    @PreAuthorize("hasAuthority('SALE_VIEW') or #userId == authentication.principal.id")
    public ResponseEntity<ApiResponse<PaginationResponse<?>>> viewSalesByCommissionUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Commission user sales fetched successfully",
                        salesService.getSalesByCommissionUser(userId, pageNo, pageSize)
                )
        );
    }

    // ==============================
    // MONTHLY SALES SUMMARY
    // ==============================
    @GetMapping("/summary/monthly")
    @PreAuthorize("hasAuthority('SALE_SUMMARY_VIEW')")
    public ResponseEntity<ApiResponse<?>> getMonthlySummary(@RequestParam int year) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Monthly sales summary fetched successfully",
                        salesService.getMonthlySummary(year)
                )
        );
    }

    // ==============================
    // YEARLY SALES SUMMARY
    // ==============================
    @GetMapping("/summary/yearly")
    @PreAuthorize("hasAuthority('SALE_SUMMARY_VIEW')")
    public ResponseEntity<ApiResponse<?>> getYearlySummary() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Yearly sales summary fetched successfully",
                        salesService.getYearlySummary()
                )
        );
    }
}
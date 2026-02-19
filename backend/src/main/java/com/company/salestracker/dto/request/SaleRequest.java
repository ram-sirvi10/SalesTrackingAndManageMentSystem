package com.company.salestracker.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SaleRequest {

    @NotBlank(message = "Deal ID is required")
    private String dealId;

    @NotNull(message = "Sale amount is required")
    @DecimalMin(value = "0.01", message = "Sale amount must be greater than 0")
    @Digits(integer = 12, fraction = 2)
    private BigDecimal saleAmount;

    private String paymentStatus;

    @NotNull(message = "Sale date is required")
    private LocalDate saleDate;
}


package com.company.salestracker.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DealRequest {

	@NotBlank(message = "Lead ID is required")
	private String leadId;

	@NotNull(message = "Expected amount is required")
	@DecimalMin(value = "0.01", message = "Amount must be greater than 0")
	private BigDecimal expectedAmount;

	@NotNull(message = "Closing date is required")
	private LocalDate closingDate;

}

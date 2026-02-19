package com.company.salestracker.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TargetRequest {

	@NotBlank(message = "User ID is required")
	private String userId;

	@NotNull(message = "Target month is required")
	@Min(value = 1, message = "Month must be between 1 and 12")
	@Max(value = 12, message = "Month must be between 1 and 12")
	private Integer targetMonth;

	@NotNull(message = "Target year is required")
	@Min(value = 2000, message = "Year must be valid")
	private Integer targetYear;

	@NotNull(message = "Target amount is required")
	@DecimalMin(value = "0.01", message = "Target amount must be greater than 0")
	@Digits(integer = 12, fraction = 2, message = "Invalid amount format")
	private BigDecimal targetAmount;
}

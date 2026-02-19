package com.company.salestracker.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SaleResponse {

	private String id;
	private String dealId;
	private String dealAssignedUser;
	private BigDecimal saleAmount;
	private String paymentStatus;
	private String invoiceNumber;
	private LocalDate saleDate;
	private String createdByUserEmail;
}

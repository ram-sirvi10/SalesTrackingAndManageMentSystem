package com.company.salestracker.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SalesSummaryResponse {

	private Integer year;
	private Integer month;
	private BigDecimal totalAmount;
	private BigDecimal paidAmount;
	private BigDecimal pendingAmount;
	private Long totalSales;
}

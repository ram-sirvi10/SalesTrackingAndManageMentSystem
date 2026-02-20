package com.company.salestracker.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportResponse {

	private String reportType;

	private LocalDate startDate;
	private LocalDate endDate;

	private Long totalLeads;
	private Long totalDeals;
	private Long totalSales;
	private BigDecimal totalRevenue;

	private BigDecimal paidRevenue;
	private BigDecimal pendingRevenue;

	private Double conversionPercentage;

	private Long totalLostDeals;
	private BigDecimal totalLostRevenue;
	private BigDecimal averageLostDealValue;

	private List<Map<String, Object>> data;
}

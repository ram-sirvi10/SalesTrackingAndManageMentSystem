package com.company.salestracker.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.company.salestracker.entity.Lead;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DealResponse {

	private String dealId;
	private LeadResponse lead;
	private String assignedUserId;
	private String assignedUserEmail;
	private String dealStage;
	private BigDecimal expectedAmount;
	private LocalDate closingDate;
	private LocalDateTime createdAt;
}

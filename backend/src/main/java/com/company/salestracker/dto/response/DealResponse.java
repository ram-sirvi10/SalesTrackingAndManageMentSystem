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

	private String id;
	private String leadEmail;
	private String leadId;
	private String assignedUserId;
	private String assignedUserEmail;
	private String dealStage;
	private BigDecimal expectedAmount;
	private LocalDate closingDate;
	private LocalDateTime createdAt;
	private String createdByUserEmail;
	private String saleId;
}

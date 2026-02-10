package com.company.salestracker.dto.response;

import java.time.LocalDate;

public class DealResponse {
	
	private String dealId;
	
	private LeadResponse lead;

	
	private String dealStage;

	
	private Double expectedAmount;

	
	private LocalDate closingDate;

	
	private UserResponse user;
}

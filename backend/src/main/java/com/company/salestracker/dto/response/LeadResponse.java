package com.company.salestracker.dto.response;

import java.time.LocalDateTime;

public class LeadResponse {

	private String leadId;

	private String name;

	private String email;

	private String phone;

	private String source;

	private String status;

	private UserResponse assignedTo;
	
	 private LocalDateTime createdAt;

}

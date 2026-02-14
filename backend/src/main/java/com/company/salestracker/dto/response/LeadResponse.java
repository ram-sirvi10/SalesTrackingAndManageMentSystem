package com.company.salestracker.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class LeadResponse {

	private String leadId;

	private String name;

	private String email;

	private String phone;

	private String source;

	private String status;

	private String assignedToId;

	private String assignedPersonEmail;

	private LocalDateTime createdAt;

}

package com.company.salestracker.dto.request;

import lombok.Data;

@Data
public class LeadStatusUpdateRequest {

	private String leadId;
	private String status;

}

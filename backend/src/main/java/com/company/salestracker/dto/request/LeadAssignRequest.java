package com.company.salestracker.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeadAssignRequest {

	private String leadId;
	private String userId;

}

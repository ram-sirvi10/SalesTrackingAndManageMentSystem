package com.company.salestracker.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LeadStatusUpdateRequest {

	@NotEmpty
	private String leadId;
	@NotEmpty

	private String status;

}

package com.company.salestracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DealAssignRequest {
	@NotBlank
	private String dealId;
	@NotBlank
	private String userId;
}

package com.company.salestracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeadAssignRequest {

	@NotBlank
	private String leadId;
	@NotBlank
	private String userId;

}

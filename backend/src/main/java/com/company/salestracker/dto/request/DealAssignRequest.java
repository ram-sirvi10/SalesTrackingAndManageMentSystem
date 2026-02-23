package com.company.salestracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DealAssignRequest {
	@NotBlank
	private String dealId;
	@NotBlank
	private String userId;
}

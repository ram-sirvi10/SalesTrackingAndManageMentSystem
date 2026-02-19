package com.company.salestracker.dto.request;

import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LeadStatusUpdateRequest {

	@NotEmpty(message = "Lead can not be empty")
	private String leadId;
	@NotEmpty(message = "Lead can not be empty")
	@Pattern(regexp = AppConstant.LEAD_STATUS_REGEX, message = AppConstant.LEAD_STATUS_ERROR)
	private String status;

}

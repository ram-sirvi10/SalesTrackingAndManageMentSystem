package com.company.salestracker.dto.request;

import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class LeadRequest {

	@NotBlank
	private String name;

	@NotBlank(message = AppConstant.EMAIL_NOT_BLANK)
	@Email(message = AppConstant.EMAIL_ERROR)
	@Pattern(regexp = AppConstant.VALID_EMAIL_REGEX, message = AppConstant.EMAIL_ERROR)
	private String email;

	@NotBlank
	@Pattern(regexp = AppConstant.VALID_PHONE_REGEX, message = AppConstant.PHONE_ERROR)
	private String phone;

	@NotBlank
	private String source;

}

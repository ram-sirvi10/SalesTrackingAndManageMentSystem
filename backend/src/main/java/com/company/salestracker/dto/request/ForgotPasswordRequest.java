package com.company.salestracker.dto.request;

import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequest {

	@NotBlank(message = AppConstant.EMAIL_NOT_BLANK)
	@Email(message = AppConstant.EMAIL_ERROR)
	@Pattern(regexp = AppConstant.VALID_EMAIL_REGEX, message = AppConstant.EMAIL_ERROR)
	private String email;
}

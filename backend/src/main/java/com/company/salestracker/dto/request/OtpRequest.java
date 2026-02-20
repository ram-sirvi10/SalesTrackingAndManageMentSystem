package com.company.salestracker.dto.request;

import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpRequest {

	@NotBlank(message = AppConstant.EMAIL_NOT_BLANK)
	@Email(message = AppConstant.EMAIL_ERROR)
	@Pattern(regexp = AppConstant.VALID_EMAIL_REGEX, message = AppConstant.EMAIL_ERROR)
	private String email;

	@NotBlank
	@Size(min = 6, max = 6)
	private String otp;
}

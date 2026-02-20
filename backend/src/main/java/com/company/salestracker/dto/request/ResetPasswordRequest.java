package com.company.salestracker.dto.request;

import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

	@NotBlank
	private String resetToken;

	@NotBlank(message = AppConstant.PASSWORD_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_PASSWORD_REGEX, message = AppConstant.PASSWORD_ERROR)
	private String newPassword;
}

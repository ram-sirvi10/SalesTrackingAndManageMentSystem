package com.company.salestracker.dto.request;

import org.springframework.stereotype.Component;

import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Component
@Getter
@Setter
public class LoginRequest {

   
	@NotBlank(message = AppConstant.EMAIL_NOT_BLANK)
	@Email(message = AppConstant.EMAIL_ERROR)
	@Pattern(regexp = AppConstant.VALID_EMAIL_REGEX, message = AppConstant.EMAIL_ERROR)
	private String email;

	@NotBlank(message = AppConstant.PASSWORD_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_PASSWORD_REGEX, message = AppConstant.PASSWORD_ERROR)
	private String password;
	
}

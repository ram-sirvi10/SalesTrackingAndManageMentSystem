package com.company.salestracker.dto.request;

import java.util.Set;

import org.springframework.stereotype.Component;

import com.company.salestracker.customannotation.ValidRoles;
import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Component
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequest {

	@NotBlank(message = AppConstant.USERNAME_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_USERNAME_REGEX, message = AppConstant.USERNAME_ERROR)
	private String name;

	@NotBlank(message = AppConstant.EMAIL_NOT_BLANK)
	@Email(message = AppConstant.EMAIL_ERROR)
	@Pattern(regexp = AppConstant.VALID_EMAIL_REGEX, message = AppConstant.EMAIL_ERROR)
	private String email;

	@NotBlank(message = AppConstant.PASSWORD_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_PASSWORD_REGEX, message = AppConstant.PASSWORD_ERROR)
	private String password;

	@NotBlank(message = AppConstant.PHONE_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_PHONE_REGEX, message = AppConstant.PHONE_ERROR)
	private String phone;
	
	
	@ValidRoles(message = AppConstant.ROLES_INVALID)
	private Set<String> roles;

}

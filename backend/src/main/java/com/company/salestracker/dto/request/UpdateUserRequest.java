package com.company.salestracker.dto.request;

import org.springframework.stereotype.Component;

import com.company.salestracker.util.AppConstant;

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
public class UpdateUserRequest {

	@NotBlank(message = AppConstant.USERNAME_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_USERNAME_REGEX, message = AppConstant.USERNAME_ERROR)
	private String name;

	@NotBlank(message = AppConstant.PHONE_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_PHONE_REGEX, message = AppConstant.PHONE_ERROR)
	private String phone;

}

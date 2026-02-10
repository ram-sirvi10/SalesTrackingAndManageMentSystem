package com.company.salestracker.dto.request;

import java.util.Set;

import com.company.salestracker.customannotation.ValidPermission;
import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoleRequest {

	
	@NotBlank(message = AppConstant.USERNAME_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_USERNAME_REGEX, message = AppConstant.USERNAME_ERROR)
	private String roleName;

	@NotBlank
	private String description;

	@ValidPermission
	private Set<String> permissions;
}

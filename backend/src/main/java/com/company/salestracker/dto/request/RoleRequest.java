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
public class RoleRequest {

	
	@NotBlank(message = AppConstant.ROLE_NAME_NOT_BLANK)
	@Pattern(regexp = AppConstant.VALID_ROLE_REGEX, message = AppConstant.ROLE_ERROR)
	private String roleName;

	@NotBlank(message = AppConstant.DESCRIPTION_ERROR)
	@Pattern(regexp =    AppConstant.DESCRIPTION_MIN_10_WORDS_REGEX ,message = AppConstant.DESCRIPTION_ERROR)
	private String description;

	@ValidPermission
	private Set<String> permissions;
}

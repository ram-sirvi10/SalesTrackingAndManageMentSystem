package com.company.salestracker.dto.request;

import java.util.Set;
import org.springframework.stereotype.Component;

import com.company.salestracker.constants.AppConstant;
import com.company.salestracker.customannotation.ValidRoles;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignRolesRequest {

	@NotBlank(message = AppConstant.USERID_NOT_BLANK)
	private String userId;

	@ValidRoles(message = AppConstant.ROLES_INVALID)
	private Set<String> roles;
}

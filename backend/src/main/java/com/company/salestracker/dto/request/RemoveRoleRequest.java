package com.company.salestracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class RemoveRoleRequest {
	@NotBlank
private String userId;
	@NotBlank
private String roleId;
}

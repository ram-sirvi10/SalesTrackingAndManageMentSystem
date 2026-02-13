package com.company.salestracker.dto.request;

import java.util.Set;

import com.company.salestracker.customannotation.ValidPermission;

import lombok.Data;

@Data
public class UpdateRolePermissionRequest {
	@ValidPermission
	private Set<String> permissions;
}

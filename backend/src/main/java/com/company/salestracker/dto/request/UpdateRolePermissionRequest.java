package com.company.salestracker.dto.request;

import java.util.List;

import com.company.salestracker.customannotation.ValidPermission;

import lombok.Data;

@Data
public class UpdateRolePermissionRequest {
	@ValidPermission
	private List<String> permissions;
}

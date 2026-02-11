package com.company.salestracker.service;

import java.util.List;
import java.util.Set;

import com.company.salestracker.dto.response.PermissionResponse;

public interface PermissionService {

	List<PermissionResponse> getAllPermission();
	Set<String> getAllPermissionIds();
}

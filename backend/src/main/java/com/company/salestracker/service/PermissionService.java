package com.company.salestracker.service;

import java.util.List;

import com.company.salestracker.dto.response.PermissionResponse;

public interface PermissionService {
	List<PermissionResponse> getAllPermission();
}

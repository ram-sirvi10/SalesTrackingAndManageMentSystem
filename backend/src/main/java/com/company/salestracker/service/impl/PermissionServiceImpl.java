package com.company.salestracker.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.company.salestracker.dto.response.PermissionResponse;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.service.PermissionService;
import com.company.salestracker.util.AppCommon;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PermissionServiceImpl implements PermissionService {

	private final AppCommon appCommon;

	@Override
	public List<PermissionResponse> getAllPermission() {

		User loginUser = appCommon.currentLoginUser();

		return loginUser.getRoles().stream().flatMap(role -> role.getPermissions().stream()).distinct()
				.map(Mapper::toResponse).toList();
	}

	@Override
	public Set<String> getAllPermissionIds() {

		User loginUser = appCommon.currentLoginUser();

		return loginUser.getRoles().stream().flatMap(role -> role.getPermissions().stream()).distinct()
				.map(per -> per.getId()).collect(Collectors.toSet());
	}

	@Override
	public List<PermissionResponse> getAllPermissionByUser(String userId) {
		return appCommon.getActiveUser(userId).getRoles().stream().flatMap(role -> role.getPermissions().stream())
				.distinct().map(Mapper::toResponse).toList();
	}

	@Override
	public List<PermissionResponse> getAllPermissionByRole(String roleId) {

		Role role = appCommon.checkRoleBelongToCurrentUser(roleId);

		return role.getPermissions().stream().map(Mapper::toResponse).toList();
	}

}

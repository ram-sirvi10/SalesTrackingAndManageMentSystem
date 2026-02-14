package com.company.salestracker.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.response.PermissionResponse;
import com.company.salestracker.entity.User;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.service.PermissionService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PermissionServiceImpl implements PermissionService {

//	private final PermissionRepository permissionRepo;
	private final UserRepository userRepo;

	@Override
	public List<PermissionResponse> getAllPermission() {

		User loginUser = currentLoginUser();

		return loginUser.getRoles().stream().flatMap(role -> role.getPermissions().stream()).distinct()
				.map(Mapper::toResponse).toList();
	}

	public Set<String> getAllPermissionIds() {

		User loginUser = currentLoginUser();

		return loginUser.getRoles().stream().flatMap(role -> role.getPermissions().stream()).distinct()
				.map(per -> per.getId()).collect(Collectors.toSet());
	}

	private User currentLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return userRepo.findByEmail(authentication.getName()).orElseThrow();
	}

}

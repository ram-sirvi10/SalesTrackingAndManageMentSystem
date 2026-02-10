package com.company.salestracker.dto.response;

import java.util.Set;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@Component
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponse {

	private String id;
	
	private String roleName;

	private String description;

	private Set<PermissionResponse> permissions;
}

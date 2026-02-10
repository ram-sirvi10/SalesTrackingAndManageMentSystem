package com.company.salestracker.dto.response;

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
public class PermissionResponse {

	private String id;
	private String permissionCode;
	private String description;
}

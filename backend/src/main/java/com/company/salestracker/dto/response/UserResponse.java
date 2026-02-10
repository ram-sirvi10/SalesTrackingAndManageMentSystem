package com.company.salestracker.dto.response;

import java.util.Set;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Component
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

	private String id;

	private String name;

	private String email;

	private String phone;

	private String status;

	private Set<RoleResponse> roles;

}

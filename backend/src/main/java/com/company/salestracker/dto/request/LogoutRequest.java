package com.company.salestracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LogoutRequest {
	@NotBlank
	private String refreshToken;
	@NotBlank
	private String accessToken;
}

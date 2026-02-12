package com.company.salestracker.dto.request;

import org.springframework.stereotype.Component;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Component
@Getter
@Setter
public class LogoutRequest {
	@NotEmpty
	private String refreshToken;
	@NotEmpty
	private String accessToken;
}

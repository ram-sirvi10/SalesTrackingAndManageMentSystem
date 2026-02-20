package com.company.salestracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class PaymentStatusUpdateRequest {

	@NotBlank
	private String saleId;
	@NotBlank
	private String paymentStatus;
}

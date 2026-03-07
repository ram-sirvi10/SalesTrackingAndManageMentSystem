package com.company.salestracker.dto.request;

import com.company.salestracker.constants.AppConstant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PaymentStatusUpdateRequest {

	@NotBlank
	private String saleId;
	@NotBlank
	@Pattern(regexp = AppConstant.PAYMENT_STATUS_REGEX, message = AppConstant.PAYMENT_STATUS_ERROR)
	private String paymentStatus;
}

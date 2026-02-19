package com.company.salestracker.dto.request;

import lombok.Data;

@Data
public class PaymentStatusUpdateRequest {

	private String saleId;
	private String paymentStatus;
}

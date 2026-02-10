package com.company.salestracker.dto.request;

import java.time.LocalDate;

public class SaleRequest {

	private String dealId;
	private Double saleAmount;
	private String paymentStatus;
	private String invoiceNumber;
	private LocalDate saleDate;
}

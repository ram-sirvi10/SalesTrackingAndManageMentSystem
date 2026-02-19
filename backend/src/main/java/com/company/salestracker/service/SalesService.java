package com.company.salestracker.service;

import java.util.List;

import com.company.salestracker.dto.request.PaymentStatusUpdateRequest;
import com.company.salestracker.dto.request.SaleRequest;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.SaleResponse;
import com.company.salestracker.dto.response.SalesSummaryResponse;

public interface SalesService {

	public SaleResponse createSale(SaleRequest request);

	public SaleResponse updatePaymentStatus(PaymentStatusUpdateRequest request);

	public SaleResponse getSaleById(String id);

	public PaginationResponse<SaleResponse> getAllSales(int pageNo, int pageSize);

	List<SalesSummaryResponse> getMonthlySummary(Integer year);

	List<SalesSummaryResponse> getYearlySummary();

	PaginationResponse<SaleResponse> getSalesByCommissionUser(String userId, int pageNo, int pageSize);

}

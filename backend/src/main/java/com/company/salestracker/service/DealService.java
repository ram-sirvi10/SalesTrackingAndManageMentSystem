package com.company.salestracker.service;

import com.company.salestracker.dto.request.DealRequest;
import com.company.salestracker.dto.request.DealStageUpdateRequest;
import com.company.salestracker.dto.response.DealResponse;
import com.company.salestracker.dto.response.PaginationResponse;

public interface DealService {

	DealResponse createDeal(DealRequest request);

	DealResponse updateDeal(String dealId, DealRequest request);

	DealResponse updateStage(DealStageUpdateRequest request);

	DealResponse getById(String dealId);

	void deleteDeal(String dealId);

	PaginationResponse<?> viewAllDeals(int pageNo, int pageSize);

	PaginationResponse<?> viewDealsByUser(String userId, int pageNo, int pageSize);

}

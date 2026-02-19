package com.company.salestracker.service;

import java.util.List;

import com.company.salestracker.dto.request.TargetRequest;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.TargetResponse;

public interface TargetService {

	TargetResponse createTarget(TargetRequest request);

	TargetResponse updateTarget(String targetId, TargetRequest request);

	void deleteTarget(String targetId);

	TargetResponse getTargetById(String targetId);

	PaginationResponse<TargetResponse> getAllTargets(int pageNo, int pageSize);

	PaginationResponse<TargetResponse> getTargetsByUser(String userId, int pageNo, int pageSize);

	List<TargetResponse> getTeamPerformance(Integer month, Integer year);

	TargetResponse getUserPerformance(String userId, Integer month, Integer year);
}

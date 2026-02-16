package com.company.salestracker.service;

import com.company.salestracker.dto.request.LeadAssignRequest;
import com.company.salestracker.dto.request.LeadRequest;
import com.company.salestracker.dto.request.LeadStatusUpdateRequest;
import com.company.salestracker.dto.response.LeadResponse;
import com.company.salestracker.dto.response.PaginationResponse;

public interface LeadService {

	public LeadResponse createLead(LeadRequest request);

	public LeadResponse updateLead(String leadId, LeadRequest request);

	public LeadResponse assignLead(LeadAssignRequest request);

	public LeadResponse updateStatus(LeadStatusUpdateRequest request);

	public PaginationResponse<?> viewAllLead(int pageNo, int pageSize);

	public PaginationResponse<?> viewAllLeadByAssignedUser(String userId, int pageNo, int pageSize);

	public LeadResponse getById(String leadId);

	void deleteLead(String leadId);

}

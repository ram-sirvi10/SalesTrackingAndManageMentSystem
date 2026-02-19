package com.company.salestracker.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.LeadAssignRequest;
import com.company.salestracker.dto.request.LeadRequest;
import com.company.salestracker.dto.request.LeadStatusUpdateRequest;
import com.company.salestracker.dto.response.LeadResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.entity.Lead;
import com.company.salestracker.entity.LeadActivity;
import com.company.salestracker.entity.LeadStatus;
import com.company.salestracker.entity.User;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.LeadActivityRepository;
import com.company.salestracker.repository.LeadRepository;
import com.company.salestracker.service.LeadService;
import com.company.salestracker.util.AppCommon;
import com.company.salestracker.util.PermissionCodeConstants;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeadServiceImpl implements LeadService {

	private final LeadRepository leadRepo;
	private final LeadActivityRepository leadActivityRepo;
	private final AppCommon appCommon;

	@Override
	public LeadResponse createLead(LeadRequest request) {

		User currentUser = appCommon.currentLoginUser();
		User ownerAdmin = appCommon.resolveOwnerAdmin(currentUser);
		Lead lead = Mapper.toEntity(request);
		lead.setOwnerAdmin(ownerAdmin);
		lead.setCreatedBy(currentUser);
		Lead savedLead = leadRepo.save(lead);
		saveLeadActivity(savedLead, "CREATE", "Lead created");
		return Mapper.toResponse(savedLead);
	}

	@Override
	public LeadResponse updateLead(String leadId, LeadRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Lead lead = appCommon.getActiveLead(leadId);
		appCommon.validateAccess(currentUser, lead.getOwnerAdmin());
		if (lead.getStatus() == LeadStatus.LOST || lead.getStatus() == LeadStatus.QUALIFIED) {
			throw new BadRequestException("Cannot update a Full filled lead");
		}

		lead.setName(request.getName());
		lead.setEmail(request.getEmail());
		lead.setPhone(request.getPhone());
		lead.setSource(request.getSource());

		Lead savedLead = leadRepo.save(lead);

		saveLeadActivity(savedLead, "UPDATE", "Lead details updated");

		return Mapper.toResponse(savedLead);
	}

	@Override
	public LeadResponse assignLead(LeadAssignRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Lead lead = appCommon.getActiveLead(request.getLeadId());
		appCommon.validateAccess(currentUser, lead.getOwnerAdmin());
		if (lead.getStatus() != LeadStatus.NEW) {
			throw new BadRequestException("Only new lead can be assign");
		}

		User assignedUser = appCommon.getActiveUser(request.getUserId());

		if (!appCommon.resolveOwnerAdmin(assignedUser).getId()
				.equals(appCommon.resolveOwnerAdmin(currentUser).getId())) {
			throw new BadRequestException("Cannot assign outside organization");
		}

		lead.setAssignedto(assignedUser);

		Lead savedLead = leadRepo.save(lead);

		saveLeadActivity(savedLead, "ASSIGN", "Lead assigned to " + assignedUser.getName());

		return Mapper.toResponse(savedLead);
	}

	@Override
	public LeadResponse updateStatus(LeadStatusUpdateRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Lead lead = appCommon.getActiveLead(request.getLeadId());

		appCommon.validateAccess(currentUser, lead.getOwnerAdmin());
		if (lead.getAssignedto() == null) {
			throw new BadRequestException("Lead must be assigned before status change");
		}
		if (!lead.getAssignedto().getId().equals(currentUser.getId())) {
			throw new BadRequestException("Only assigned user can update status");
		}

		LeadStatus oldStatus = lead.getStatus();
		LeadStatus newStatus;

		try {
			newStatus = LeadStatus.valueOf(request.getStatus().toUpperCase());
		} catch (IllegalArgumentException e) {
			throw new BadRequestException("Invalid status value");
		}

		if (oldStatus == newStatus) {
			throw new BadRequestException("Lead is already in " + newStatus + " status");
		}

		if (oldStatus == LeadStatus.LOST || oldStatus == LeadStatus.QUALIFIED) {
			throw new BadRequestException("Full filled lead status cannot be changed");
		}

		if (!oldStatus.canMoveTo(newStatus)) {
			throw new BadRequestException("Invalid status transition from " + oldStatus + " to " + newStatus);
		}

		lead.setStatus(newStatus);

		Lead savedLead = leadRepo.save(lead);

		saveLeadActivity(savedLead, "STATUS_CHANGE", "Status changed from " + oldStatus + " to " + newStatus);

		return Mapper.toResponse(savedLead);
	}

	@Override
	public LeadResponse getById(String leadId) {

		User currentUser = appCommon.currentLoginUser();
		Lead lead = appCommon.getActiveLead(leadId);
		appCommon.validateAccess(currentUser, lead.getOwnerAdmin());
		return Mapper.toResponse(lead);
	}

	@Override
	public void deleteLead(String leadId) {

		User currentUser = appCommon.currentLoginUser();
		Lead lead = appCommon.getActiveLead(leadId);

		appCommon.validateAccess(currentUser, lead.getOwnerAdmin());
		if (lead.getStatus() == LeadStatus.LOST || lead.getStatus() == LeadStatus.QUALIFIED) {
			throw new BadRequestException("Cannot Delete a fulfill lead");
		}

		lead.setIsDelete(true);
		leadRepo.save(lead);

		saveLeadActivity(lead, "DELETE", "Lead deleted");
	}

	@Override
	public PaginationResponse<?> viewAllLead(int pageNo, int pageSize) {

		User currentUser = appCommon.currentLoginUser();
		User ownerAdmin = appCommon.resolveOwnerAdmin(currentUser);

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Lead> leads = leadRepo.findByOwnerAdminAndIsDeleteFalse(ownerAdmin, pageable);

		return Mapper.toPaginationResponse(leads.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> viewAllLeadByAssignedUser(String userId, int pageNo, int pageSize) {

		User currentUser = appCommon.currentLoginUser();
		User targetUser = appCommon.getActiveUser(userId);

		if (!(currentUser.getId().equals(targetUser.getId())
				&& appCommon.hasPermission(currentUser, PermissionCodeConstants.VIEW_ASSIGNED_LEAD_OF_OTHER_USER))) {
			throw new BadRequestException("Access denied");
		}
		if (!appCommon.resolveOwnerAdmin(targetUser).getId().equals(appCommon.resolveOwnerAdmin(currentUser).getId())) {
			throw new BadRequestException("Access denied");
		}

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Lead> leads = leadRepo.findByAssignedtoAndIsDeleteFalse(targetUser, pageable);

		return Mapper.toPaginationResponse(leads.map(Mapper::toResponse));
	}

	private void saveLeadActivity(Lead lead, String type, String notes) {

		LeadActivity activity = LeadActivity.builder().lead(lead).activityType(type).notes(notes)
				.createdBy(appCommon.currentLoginUser()).ownerAdmin(appCommon.currentLoginUser().getOwnerAdmin())
				.build();

		leadActivityRepo.save(activity);
	}

}

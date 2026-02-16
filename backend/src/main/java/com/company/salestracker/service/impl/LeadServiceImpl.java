package com.company.salestracker.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.LeadActivityRepository;
import com.company.salestracker.repository.LeadRepository;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.service.LeadService;
import com.company.salestracker.util.AppConstant;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeadServiceImpl implements LeadService {

	private final LeadRepository leadRepo;
	private final LeadActivityRepository leadActivityRepo;
	private final UserRepository userRepo;

	@Override
	public LeadResponse createLead(LeadRequest request) {

		User currentUser = currentLoginUser();
		User ownerAdmin = resolveOwnerAdmin(currentUser);
		Lead lead = Mapper.toEntity(request);
		lead.setOwnerAdmin(ownerAdmin);
		lead.setCreatedBy(currentUser);
		Lead savedLead = leadRepo.save(lead);
		saveActivity(savedLead, "CREATE", "Lead created");
		return Mapper.toResponse(savedLead);
	}

	@Override
	public LeadResponse updateLead(String leadId, LeadRequest request) {

		User currentUser = currentLoginUser();
		Lead lead = getActiveLead(leadId);

		validateLeadAccess(currentUser, lead);
		if (lead.getStatus() == LeadStatus.LOST) {
			throw new BadRequestException("Cannot update a LOST lead");
		}
		if (lead.getStatus() == LeadStatus.QUALIFIED) {
			throw new BadRequestException("Qualified leads cannot be edited");
		}

		lead.setName(request.getName());
		lead.setEmail(request.getEmail());
		lead.setPhone(request.getPhone());
		lead.setSource(request.getSource());

		Lead savedLead = leadRepo.save(lead);

		saveActivity(savedLead, "UPDATE", "Lead details updated");

		return Mapper.toResponse(savedLead);
	}

	@Override
	public LeadResponse assignLead(LeadAssignRequest request) {

		User currentUser = currentLoginUser();
		Lead lead = getActiveLead(request.getLeadId());
		validateLeadAccess(currentUser, lead);
		if (lead.getStatus() == LeadStatus.LOST) {
			throw new BadRequestException("Cannot Assign a LOST lead");
		}
		if (lead.getStatus() == LeadStatus.QUALIFIED) {
			throw new BadRequestException("Cannot Assign a QUALIFIED lead");
		}
		if (lead.getStatus() == LeadStatus.CONTACTED) {
			throw new BadRequestException("Lead alreday CONTACTED ");
		}
		User assignedUser = getActiveUser(request.getUserId());

		if (!resolveOwnerAdmin(assignedUser).getId().equals(resolveOwnerAdmin(currentUser).getId())) {
			throw new BadRequestException("Cannot assign outside organization");
		}

		lead.setAssignedto(assignedUser);

		Lead savedLead = leadRepo.save(lead);

		saveActivity(savedLead, "ASSIGN", "Lead assigned to " + assignedUser.getName());

		return Mapper.toResponse(savedLead);
	}

	@Override
	public LeadResponse updateStatus(LeadStatusUpdateRequest request) {

		User currentUser = currentLoginUser();
		Lead lead = getActiveLead(request.getLeadId());

		validateLeadAccess(currentUser, lead);
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

		if (oldStatus == LeadStatus.LOST) {
			throw new BadRequestException("LOST lead status cannot be changed");
		}
		if (oldStatus == LeadStatus.QUALIFIED) {
			throw new BadRequestException("QUALIFIED lead status cannot be changed");
		}

		boolean valid = false;

		switch (oldStatus) {

		case NEW:
			valid = (newStatus == LeadStatus.CONTACTED || newStatus == LeadStatus.LOST);
			break;

		case CONTACTED:
			valid = (newStatus == LeadStatus.QUALIFIED || newStatus == LeadStatus.LOST);
			break;

		default:
			valid = false;
		}

		if (!valid) {
			throw new BadRequestException("Invalid status transition from " + oldStatus + " to " + newStatus);
		}

		lead.setStatus(newStatus);

		Lead savedLead = leadRepo.save(lead);

		saveActivity(savedLead, "STATUS_CHANGE", "Status changed from " + oldStatus + " to " + newStatus);

		return Mapper.toResponse(savedLead);
	}

	@Override
	public LeadResponse getById(String leadId) {

		User currentUser = currentLoginUser();
		Lead lead = getActiveLead(leadId);
		validateLeadAccess(currentUser, lead);
		return Mapper.toResponse(lead);
	}

	@Override
	public void deleteLead(String leadId) {

		User currentUser = currentLoginUser();
		Lead lead = getActiveLead(leadId);

		validateLeadAccess(currentUser, lead);
		if (lead.getStatus() == LeadStatus.LOST) {
			throw new BadRequestException("Cannot Delete a LOST lead");
		}
		if (lead.getStatus() == LeadStatus.QUALIFIED) {
			throw new BadRequestException("Cannot Delete a QUALIFIED lead");
		}
		if (lead.getStatus() == LeadStatus.CONTACTED) {
			throw new BadRequestException("Cannot Delete a CONTACTED lead");
		}

		lead.setIsDelete(true);
		leadRepo.save(lead);

		saveActivity(lead, "DELETE", "Lead deleted");
	}

	@Override
	public PaginationResponse<?> viewAllLead(int pageNo, int pageSize) {

		User currentUser = currentLoginUser();
		User ownerAdmin = resolveOwnerAdmin(currentUser);

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Lead> leads = leadRepo.findByOwnerAdminAndIsDeleteFalse(ownerAdmin, pageable);

		return Mapper.toPaginationResponse(leads.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> viewAllLeadByAssignedUser(String userId, int pageNo, int pageSize) {

		User currentUser = currentLoginUser();
		User targetUser = getActiveUser(userId);

		if (!resolveOwnerAdmin(targetUser).getId().equals(resolveOwnerAdmin(currentUser).getId())) {

			throw new BadRequestException("Access denied");
		}

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Lead> leads = leadRepo.findByAssignedtoAndIsDeleteFalse(targetUser, pageable);

		return Mapper.toPaginationResponse(leads.map(Mapper::toResponse));
	}

	private Lead getActiveLead(String id) {
		return leadRepo.findByIdAndIsDeleteFalse(id).orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
	}

	private void validateLeadAccess(User currentUser, Lead lead) {

		User currentOwner = resolveOwnerAdmin(currentUser);
		User leadOwner = lead.getOwnerAdmin();

		if (!leadOwner.getId().equals(currentOwner.getId())) {
			throw new BadRequestException("Access denied");
		}
	}

	private User resolveOwnerAdmin(User user) {
		return user.getOwnerAdmin() == null ? user : user.getOwnerAdmin();
	}

	private User getActiveUser(String id) {
		User user = userRepo.findById(id).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
		if (!user.getStatus().equals(UserStatus.ACTIVE)) {
			throw new ResourceNotFoundException("User is blocked");
		}
		return user;
	}

	private User currentLoginUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getName() == null) {
			throw new BadRequestException("User not authenticated");
		}

		return userRepo.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	private void saveActivity(Lead lead, String type, String notes) {

		LeadActivity activity = LeadActivity.builder().lead(lead).activityType(type).notes(notes)
				.user(currentLoginUser()).build();

		leadActivityRepo.save(activity);
	}

}

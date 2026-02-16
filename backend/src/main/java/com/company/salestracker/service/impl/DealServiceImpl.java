package com.company.salestracker.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.DealRequest;
import com.company.salestracker.dto.request.DealStageUpdateRequest;
import com.company.salestracker.dto.response.DealResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.entity.Deal;
import com.company.salestracker.entity.DealStage;
import com.company.salestracker.entity.Lead;
import com.company.salestracker.entity.LeadStatus;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.DealRepository;
import com.company.salestracker.repository.LeadRepository;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.service.DealService;
import com.company.salestracker.util.DateUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional

public class DealServiceImpl implements DealService {

	private final DealRepository dealRepo;
	private final LeadRepository leadRepo;
	private final UserRepository userRepo;

	@Override
	public DealResponse createDeal(DealRequest request) {

		User currentUser = currentLoginUser();
		Lead lead = getActiveLead(request.getLeadId());

		validateAccess(currentUser, lead.getOwnerAdmin());

		if (lead.getStatus() != LeadStatus.QUALIFIED) {
			throw new BadRequestException("Deal can only be created for QUALIFIED lead");
		}

		if (!DateUtil.isFutureDate(request.getClosingDate())) {
			throw new BadRequestException("Closing date must be a future date");
		}

		User assignedUser = getActiveUser(request.getUserId());
		validateAccess(currentUser, assignedUser);

		Deal deal = Deal.builder().lead(lead).user(assignedUser).dealStage(DealStage.OPEN)
				.expectedAmount(request.getExpectedAmount()).closingDate(request.getClosingDate()).build();

		return Mapper.toDealResponse(dealRepo.save(deal));
	}

	@Override
	public DealResponse updateDeal(String dealId, DealRequest request) {

		User currentUser = currentLoginUser();
		Deal deal = getActiveDeal(dealId);

		validateAccess(currentUser, deal.getLead().getOwnerAdmin());

		if (deal.getDealStage() == DealStage.WON || deal.getDealStage() == DealStage.LOST) {
			throw new BadRequestException("Closed deal cannot be edited");
		}

		if (request.getExpectedAmount() != null) {
			deal.setExpectedAmount(request.getExpectedAmount());
		}

		if (request.getClosingDate() != null) {

			if (!DateUtil.isFutureDate(request.getClosingDate())) {
				throw new BadRequestException("Closing date must be a future date");
			}

			deal.setClosingDate(request.getClosingDate());
		}

		if (request.getUserId() != null) {
			User assignedUser = getActiveUser(request.getUserId());
			validateAccess(currentUser, assignedUser);
			deal.setUser(assignedUser);
		}

		return Mapper.toDealResponse(dealRepo.save(deal));
	}

	@Override
	public DealResponse updateStage(DealStageUpdateRequest request) {

		User currentUser = currentLoginUser();
		Deal deal = getActiveDeal(request.getDealId());

		validateAccess(currentUser, deal.getLead().getOwnerAdmin());

		if (!deal.getUser().getId().equals(currentUser.getId())) {
			throw new BadRequestException("Only assigned user can update stage");
		}

		DealStage newStage;

		try {
			newStage = DealStage.valueOf(request.getStage().toUpperCase());
		} catch (Exception e) {
			throw new BadRequestException("Invalid stage value");
		}

		if (deal.getDealStage() == newStage) {
			throw new BadRequestException("Deal already in this stage");
		}

		if (!deal.getDealStage().canMoveTo(newStage)) {
			throw new BadRequestException("Invalid stage transition");
		}

		deal.setDealStage(newStage);

		return Mapper.toDealResponse(dealRepo.save(deal));
	}

	@Override
	public DealResponse getById(String dealId) {

		User currentUser = currentLoginUser();
		Deal deal = getActiveDeal(dealId);
		validateAccess(currentUser, deal.getLead().getOwnerAdmin());

		return Mapper.toDealResponse(deal);
	}

	@Override
	public void deleteDeal(String dealId) {

		User currentUser = currentLoginUser();
		Deal deal = getActiveDeal(dealId);

		validateAccess(currentUser, deal.getLead().getOwnerAdmin());

		if (deal.getDealStage() == DealStage.WON || deal.getDealStage() == DealStage.LOST) {
			throw new BadRequestException("Closet deal cannot be deleted");
		}

		deal.setIsDelete(true);
		deal.setDealStage(DealStage.LOST);
		dealRepo.save(deal);
	}

	@Override
	public PaginationResponse<?> viewAllDeals(int pageNo, int pageSize) {

		User currentUser = currentLoginUser();
		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Deal> deals = dealRepo.findByLeadOwnerAdminAndIsDeleteFalse(resolveOwnerAdmin(currentUser), pageable);

		return Mapper.toPaginationResponse(deals.map(Mapper::toDealResponse));
	}

	@Override
	public PaginationResponse<?> viewDealsByUser(String userId, int pageNo, int pageSize) {

		User currentUser = currentLoginUser();
		User targetUser = getActiveUser(userId);

		validateAccess(currentUser, targetUser);

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Deal> deals = dealRepo.findByUserAndIsDeleteFalse(targetUser, pageable);

		return Mapper.toPaginationResponse(deals.map(Mapper::toDealResponse));
	}

	private Deal getActiveDeal(String id) {
		return dealRepo.findById(id).filter(deal -> !Boolean.TRUE.equals(deal.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException("Deal not found"));
	}

	private Lead getActiveLead(String id) {
		return leadRepo.findByIdAndIsDeleteFalse(id).orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
	}

	private User getActiveUser(String id) {

		User user = userRepo.findById(id).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (!user.getStatus().equals(UserStatus.ACTIVE)) {
			throw new ResourceNotFoundException("User is blocked");
		}

		return user;
	}

	private void validateAccess(User currentUser, User dealOwner) {

		User currentOwner = resolveOwnerAdmin(currentUser);

		if (dealOwner != null && dealOwner.getId().equals(currentOwner.getId())) {
			return;
		}
		throw new BadRequestException("Access denied");

	}

	private User resolveOwnerAdmin(User user) {
		return user.getOwnerAdmin() == null ? user : user.getOwnerAdmin();
	}

	private User currentLoginUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getName() == null) {
			throw new BadRequestException("User not authenticated");
		}

		return userRepo.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}
}

package com.company.salestracker.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.DealAssignRequest;
import com.company.salestracker.dto.request.DealRequest;
import com.company.salestracker.dto.request.DealStageUpdateRequest;
import com.company.salestracker.dto.response.DealResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.entity.Deal;
import com.company.salestracker.entity.DealStage;
import com.company.salestracker.entity.Lead;
import com.company.salestracker.entity.LeadStatus;
import com.company.salestracker.entity.User;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.DealRepository;
import com.company.salestracker.service.DealService;
import com.company.salestracker.util.AppCommon;
import com.company.salestracker.util.DateUtil;
import com.company.salestracker.util.PermissionCodeConstants;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional

public class DealServiceImpl implements DealService {

	private final DealRepository dealRepo;
	private final AppCommon appCommon;

	@Override
	public DealResponse createDeal(DealRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Lead lead = appCommon.getActiveLead(request.getLeadId());

		appCommon.validateAccess(currentUser, lead.getOwnerAdmin());

		if (lead.getStatus() != LeadStatus.QUALIFIED) {
			throw new BadRequestException("Deal can only be created for QUALIFIED lead");
		}

		if (!DateUtil.isFutureDate(request.getClosingDate())) {
			throw new BadRequestException("Closing date must be a future date");
		}

//		User assignedUser = appCommon.getActiveUser(request.getUserId());
//		appCommon.validateAccess(currentUser, assignedUser);

		Deal deal = Deal.builder().lead(lead).dealStage(DealStage.OPEN).createdBy(currentUser)
				.ownerAdmin(currentUser.getOwnerAdmin()).expectedAmount(request.getExpectedAmount())
				.closingDate(request.getClosingDate()).build();

		return Mapper.toResponse(dealRepo.save(deal));
	}

	@Override
	public DealResponse assignDeal(DealAssignRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Deal deal = appCommon.getActiveDeal(request.getDealId());
		appCommon.validateAccess(currentUser, deal.getOwnerAdmin());
		if (deal.getDealStage() != DealStage.OPEN) {
			throw new BadRequestException("Only Open deal can be assign");
		}

		User assignedUser = appCommon.getActiveUser(request.getUserId());

		if (!appCommon.resolveOwnerAdmin(assignedUser).getId()
				.equals(appCommon.resolveOwnerAdmin(currentUser).getId())) {
			throw new BadRequestException("Cannot assign outside organization");
		}
		deal.setAssignedTo(assignedUser);

		return Mapper.toResponse(dealRepo.save(deal));
	}

	@Override
	public DealResponse updateDeal(String dealId, DealRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Deal deal = appCommon.getActiveDeal(dealId);

		appCommon.validateAccess(currentUser, deal.getOwnerAdmin());

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

		return Mapper.toResponse(dealRepo.save(deal));
	}

	@Override
	public DealResponse updateStage(DealStageUpdateRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Deal deal = appCommon.getActiveDeal(request.getDealId());

		appCommon.validateAccess(currentUser, deal.getOwnerAdmin());

		if (!deal.getAssignedTo().getId().equals(currentUser.getId())) {
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

		return Mapper.toResponse(dealRepo.save(deal));
	}

	@Override
	public DealResponse getById(String dealId) {

		User currentUser = appCommon.currentLoginUser();
		Deal deal = appCommon.getActiveDeal(dealId);
		appCommon.validateAccess(currentUser, deal.getOwnerAdmin());

		return Mapper.toResponse(deal);
	}

	@Override
	public void deleteDeal(String dealId) {

		User currentUser = appCommon.currentLoginUser();
		Deal deal = appCommon.getActiveDeal(dealId);

		appCommon.validateAccess(currentUser, deal.getOwnerAdmin());

		if (deal.getDealStage() == DealStage.WON || deal.getDealStage() == DealStage.LOST) {
			throw new BadRequestException("Closet deal cannot be deleted");
		}

		deal.setIsDelete(true);
		deal.setDealStage(DealStage.LOST);
		dealRepo.save(deal);
	}

	@Override
	public PaginationResponse<?> viewAllDeals(int pageNo, int pageSize) {

		User currentUser = appCommon.currentLoginUser();
		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Deal> deals = dealRepo.findByOwnerAdminAndIsDeleteFalse(appCommon.resolveOwnerAdmin(currentUser),
				pageable);

		return Mapper.toPaginationResponse(deals.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<?> viewDealsByAssignedUser(String userId, int pageNo, int pageSize) {

		User currentUser = appCommon.currentLoginUser();
		User targetUser = appCommon.getActiveUser(userId);
		if (!(currentUser.getId().equals(targetUser.getId())
				&& !appCommon.hasPermission(currentUser, PermissionCodeConstants.VIEW_ASSIGNED_DEAL_OF_OTHER_USER))) {
			throw new BadRequestException("Access denied");
		}
		appCommon.validateAccess(currentUser, targetUser);

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Deal> deals = dealRepo.findByCreatedByAndIsDeleteFalse(targetUser, pageable);

		return Mapper.toPaginationResponse(deals.map(Mapper::toResponse));
	}

}

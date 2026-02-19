package com.company.salestracker.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.TargetRequest;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.TargetResponse;
import com.company.salestracker.entity.Target;
import com.company.salestracker.entity.User;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.SalesRepository;
import com.company.salestracker.repository.TargetRepository;
import com.company.salestracker.service.TargetService;
import com.company.salestracker.util.AppCommon;
import com.company.salestracker.util.PermissionCodeConstants;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TargetServiceImpl implements TargetService {

	private final TargetRepository targetRepo;
	private final SalesRepository saleRepo;
	private final AppCommon appCommon;

	@Override
	public TargetResponse createTarget(TargetRequest request) {

		User currentUser = appCommon.currentLoginUser();
		User ownerAdmin = appCommon.resolveOwnerAdmin(currentUser);
		User targetUser = appCommon.getActiveUser(request.getUserId());

		appCommon.validateAccess(currentUser, appCommon.resolveOwnerAdmin(targetUser));

		validateMonthYear(request);

		if (targetRepo.existsByUserAndTargetMonthAndTargetYearAndIsDeleteFalse(targetUser, request.getTargetMonth(),
				request.getTargetYear())) {
			throw new BadRequestException("Target already exists for this month and year");
		}

		Target target = Mapper.toEntity(request, targetUser);
		target.setOwnerAdmin(ownerAdmin);
		target.setCreatedBy(currentUser);

		return buildTargetWithPerformance(targetRepo.save(target));
	}

	@Override
	public TargetResponse updateTarget(String targetId, TargetRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Target existingTarget = getActiveTarget(targetId);

		appCommon.validateAccess(currentUser, existingTarget.getOwnerAdmin());

		LocalDate now = LocalDate.now();

		LocalDate currentMonth = LocalDate.of(now.getYear(), now.getMonth(), 1);

		LocalDate existingTargetMonth = LocalDate.of(existingTarget.getTargetYear(), existingTarget.getTargetMonth(),
				1);

		if (!existingTargetMonth.isAfter(currentMonth)) {
			throw new BadRequestException("Past and current month targets cannot be updated");
		}

		validateMonthYear(request);

		User targetUser = appCommon.getActiveUser(request.getUserId());

		appCommon.validateAccess(currentUser, appCommon.resolveOwnerAdmin(targetUser));

		boolean isChanged = !existingTarget.getUser().getId().equals(targetUser.getId())
				|| !existingTarget.getTargetMonth().equals(request.getTargetMonth())
				|| !existingTarget.getTargetYear().equals(request.getTargetYear());

		if (isChanged) {

			boolean duplicateExists = targetRepo.existsByUserAndTargetMonthAndTargetYearAndIsDeleteFalse(targetUser,
					request.getTargetMonth(), request.getTargetYear());

			if (duplicateExists) {
				throw new BadRequestException("Target already exists for this user, month and year");
			}
		}

		existingTarget.setUser(targetUser);
		existingTarget.setTargetMonth(request.getTargetMonth());
		existingTarget.setTargetYear(request.getTargetYear());
		existingTarget.setTargetAmount(request.getTargetAmount());

		Target saved = targetRepo.save(existingTarget);

		return buildTargetWithPerformance(saved);
	}

	@Override
	public TargetResponse getTargetById(String targetId) {

		User currentUser = appCommon.currentLoginUser();
		Target target = getActiveTarget(targetId);

		appCommon.validateAccess(currentUser, target.getOwnerAdmin());

		return buildTargetWithPerformance(target);
	}

	@Override
	public PaginationResponse<TargetResponse> getAllTargets(int pageNo, int pageSize) {

		User currentUser = appCommon.currentLoginUser();
		User ownerAdmin = appCommon.resolveOwnerAdmin(currentUser);

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Target> targetPage = targetRepo.findByOwnerAdminAndIsDeleteFalse(ownerAdmin, pageable);

		Page<TargetResponse> responsePage = targetPage.map(this::buildTargetWithPerformance);

		return Mapper.toPaginationResponse(responsePage);
	}

	@Override
	public PaginationResponse<TargetResponse> getTargetsByUser(String userId, int pageNo, int pageSize) {

		User currentUser = appCommon.currentLoginUser();
		User targetUser = appCommon.getActiveUser(userId);
		if (!currentUser.getId().equals(targetUser.getId())
				&& !appCommon.hasPermission(currentUser, PermissionCodeConstants.VIEW_TARGET_OF_OTHER_USER)) {
			throw new BadRequestException("Access denied");
		}
		appCommon.validateAccess(currentUser, appCommon.resolveOwnerAdmin(targetUser));

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Target> targetPage = targetRepo.findByUserAndIsDeleteFalse(targetUser, pageable);

		Page<TargetResponse> responsePage = targetPage.map(this::buildTargetWithPerformance);

		return Mapper.toPaginationResponse(responsePage);
	}

	@Override
	public void deleteTarget(String targetId) {

		User currentUser = appCommon.currentLoginUser();
		Target target = getActiveTarget(targetId);

		appCommon.validateAccess(currentUser, target.getOwnerAdmin());

		target.setIsDelete(true);
		targetRepo.save(target);
	}

	@Override
	public List<TargetResponse> getTeamPerformance(Integer month, Integer year) {

		User currentUser = appCommon.currentLoginUser();
		User ownerAdmin = appCommon.resolveOwnerAdmin(currentUser);

		List<Target> targets = targetRepo.findByOwnerAdminAndTargetMonthAndTargetYearAndIsDeleteFalse(ownerAdmin, month,
				year);

		if (targets.isEmpty()) {
			return List.of();
		}

		Map<String, BigDecimal> achievementMap = calculateBulkAchievements(targets, month, year);

		return targets.stream().map(target -> mapToTargetResponseWithPerformance(target,
				achievementMap.getOrDefault(target.getUser().getId(), BigDecimal.ZERO))).toList();
	}

	@Override
	public TargetResponse getUserPerformance(String userId, Integer month, Integer year) {

		User currentUser = appCommon.currentLoginUser();
		User targetUser = appCommon.getActiveUser(userId);

		if (!currentUser.getId().equals(targetUser.getId())
				&& !appCommon.hasPermission(currentUser, PermissionCodeConstants.VIEW_TARGET_OF_OTHER_USER)) {
			throw new BadRequestException("Access denied");
		}
		appCommon.validateAccess(currentUser, appCommon.resolveOwnerAdmin(targetUser));
		Target target = targetRepo.findByUserAndTargetMonthAndTargetYearAndIsDeleteFalse(targetUser, month, year)
				.orElseThrow(() -> new ResourceNotFoundException("Target not found"));

		Map<String, BigDecimal> achievementMap = calculateBulkAchievements(List.of(target), month, year);

		BigDecimal achievedAmount = achievementMap.getOrDefault(userId, BigDecimal.ZERO);

		return mapToTargetResponseWithPerformance(target, achievedAmount);
	}

	private Map<String, BigDecimal> calculateBulkAchievements(List<Target> targets, Integer month, Integer year) {

		if (targets.isEmpty()) {
			return Map.of();
		}

		List<String> userIds = targets.stream().map(t -> t.getUser().getId()).distinct().toList();

		LocalDate startDate = LocalDate.of(year, month, 1);
		LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

		List<Object[]> result = saleRepo.getTotalSalesGroupedByUsers(userIds, startDate, endDate);

		Map<String, BigDecimal> achievementMap = new HashMap<>();

		for (Object[] row : result) {
			achievementMap.put((String) row[0], (BigDecimal) row[1]);
		}

		return achievementMap;
	}

	private TargetResponse buildTargetWithPerformance(Target target) {

		Map<String, BigDecimal> achievementMap = calculateBulkAchievements(List.of(target), target.getTargetMonth(),
				target.getTargetYear());

		BigDecimal achievedAmount = achievementMap.getOrDefault(target.getUser().getId(), BigDecimal.ZERO);

		return mapToTargetResponseWithPerformance(target, achievedAmount);
	}

	private TargetResponse mapToTargetResponseWithPerformance(Target target, BigDecimal achievedAmount) {

		BigDecimal percentage = calculatePercentage(target.getTargetAmount(), achievedAmount);

		TargetResponse response = Mapper.toResponse(target);
		response.setAchievedAmount(achievedAmount);
		response.setAchievementPercentage(percentage);

		return response;
	}

	private BigDecimal calculatePercentage(BigDecimal targetAmount, BigDecimal achievedAmount) {

		if (targetAmount.compareTo(BigDecimal.ZERO) <= 0) {
			return BigDecimal.ZERO;
		}

		return achievedAmount.multiply(BigDecimal.valueOf(100)).divide(targetAmount, 2, RoundingMode.HALF_UP);
	}

	private void validateMonthYear(TargetRequest request) {

		if (request.getTargetMonth() < 1 || request.getTargetMonth() > 12) {
			throw new BadRequestException("Invalid month value");
		}

		if (request.getTargetYear() < 2000 || request.getTargetYear() > LocalDate.now().getYear()) {
			throw new BadRequestException("Invalid year value");
		}
	}

	private Target getActiveTarget(String id) {
		return targetRepo.findByIdAndIsDeleteFalse(id)
				.orElseThrow(() -> new ResourceNotFoundException("Target not found"));
	}
}

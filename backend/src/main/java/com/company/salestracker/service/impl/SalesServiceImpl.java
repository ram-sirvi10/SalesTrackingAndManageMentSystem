package com.company.salestracker.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.PaymentStatusUpdateRequest;
import com.company.salestracker.dto.request.SaleRequest;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.SaleResponse;
import com.company.salestracker.dto.response.SalesSummaryResponse;
import com.company.salestracker.entity.Deal;
import com.company.salestracker.entity.DealStage;
import com.company.salestracker.entity.PaymentStatus;
import com.company.salestracker.entity.Sale;
import com.company.salestracker.entity.User;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.mapper.Mapper;
import com.company.salestracker.repository.SalesRepository;
import com.company.salestracker.service.SalesService;
import com.company.salestracker.util.AppCommon;
import com.company.salestracker.util.DateUtil;
import com.company.salestracker.util.PermissionCodeConstants;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SalesServiceImpl implements SalesService {
	private final SalesRepository saleRepo;
	private final AppCommon appCommon;

	@Override
	public SaleResponse createSale(SaleRequest request) {
		User currentUser = appCommon.currentLoginUser();
		Deal deal = appCommon.getActiveDeal(request.getDealId());
		appCommon.validateAccess(currentUser, deal.getOwnerAdmin());

		if (deal.getDealStage() != DealStage.WON) {
			throw new BadRequestException("Sale can only be created for Won deal");
		}
		if (DateUtil.isFutureDate(request.getSaleDate())) {
			throw new BadRequestException("Sale date can not be future date");
		}

		if (saleRepo.existsByDealAndIsDeleteFalse(deal)) {
			throw new BadRequestException("Sale already created for this deal");
		}
		BigDecimal expected = deal.getExpectedAmount();
		BigDecimal saleAmount = request.getSaleAmount();

		BigDecimal minAllowed = expected.multiply(BigDecimal.valueOf(0.75));
		BigDecimal maxAllowed = expected.multiply(BigDecimal.valueOf(1.25));

		if (saleAmount.compareTo(minAllowed) < 0 || saleAmount.compareTo(maxAllowed) > 0) {

			throw new BadRequestException("Sale amount must be within 25% of expected amount");
		}

		Sale sale = Sale.builder().deal(deal).saleAmount(request.getSaleAmount()).paymentStatus(PaymentStatus.PENDING)
				.invoiceNumber(generateInvoice()).saleDate(request.getSaleDate())
				.ownerAdmin(appCommon.resolveOwnerAdmin(currentUser)).createdBy(currentUser)
				.commissionUser(deal.getAssignedTo() != null ? deal.getAssignedTo() : currentUser).build();

		saleRepo.save(sale);

		return Mapper.toResponse(sale);
	}

	@Override
	public SaleResponse updatePaymentStatus(PaymentStatusUpdateRequest request) {

		User currentUser = appCommon.currentLoginUser();
		Sale sale = appCommon.getActiveSale(request.getSaleId());
		appCommon.validateAccess(currentUser, sale.getOwnerAdmin());
		if (sale.getPaymentStatus() != PaymentStatus.PENDING)
			throw new BadRequestException("Payment Status not panding");

		PaymentStatus paymentStatus;

		try {
			paymentStatus = PaymentStatus.valueOf(request.getPaymentStatus().toUpperCase());
		} catch (Exception e) {
			throw new BadRequestException("Invalid payment status");
		}
		sale.setPaymentStatus(paymentStatus);
		saleRepo.save(sale);

		return Mapper.toResponse(sale);
	}

	@Override
	public SaleResponse getSaleById(String id) {
		User currentUser = appCommon.currentLoginUser();
		Sale sale = appCommon.getActiveSale(id);
		appCommon.validateAccess(currentUser, sale.getOwnerAdmin());

		return Mapper.toResponse(sale);
	}

	@Override
	public PaginationResponse<SaleResponse> getAllSales(int pageNo, int pageSize) {
		User currentUser = appCommon.currentLoginUser();
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		Page<Sale> sales = saleRepo.findByOwnerAdminAndIsDeleteFalse(appCommon.resolveOwnerAdmin(currentUser),
				pageable);
		return Mapper.toPaginationResponse(sales.map(Mapper::toResponse));
	}

	@Override
	public PaginationResponse<SaleResponse> getSalesByCommissionUser(String userId, int pageNo, int pageSize) {
		User currentUser = appCommon.currentLoginUser();
		User targetUser = appCommon.getActiveUser(userId);
		if (!currentUser.getId().equals(targetUser.getId())
				&& !appCommon.hasPermission(currentUser, PermissionCodeConstants.VIEW_SALES_OF_OTHER_USER)) {
			throw new BadRequestException("Access denied");
		}

		appCommon.validateAccess(currentUser, targetUser);

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		Page<Sale> deals = saleRepo.findByCommissionUserAndIsDeleteFalse(targetUser, pageable);

		return Mapper.toPaginationResponse(deals.map(Mapper::toResponse));
	}

	@Override
	public List<SalesSummaryResponse> getMonthlySummary(Integer year) {

		if (year == null) {
			throw new BadRequestException("Year is required for monthly summary");
		}

		int currentYear = LocalDate.now().getYear();

		if (year < 2000 || year > currentYear) {
			throw new BadRequestException("Invalid year value");
		}

		User currentUser = appCommon.currentLoginUser();
		User ownerAdmin = appCommon.resolveOwnerAdmin(currentUser);

		return saleRepo.getMonthlySalesSummaryByYear(ownerAdmin, year);
	}

	@Override
	public List<SalesSummaryResponse> getYearlySummary() {

		User currentUser = appCommon.currentLoginUser();
		User ownerAdmin = appCommon.resolveOwnerAdmin(currentUser);

		return saleRepo.getYearlySalesSummary(ownerAdmin);
	}

	private String generateInvoice() {
		String prefix = "INV";
		String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
		long count = saleRepo.count() + 1;

		return prefix + "-" + datePart + "-" + String.format("%05d", count);
	}

}

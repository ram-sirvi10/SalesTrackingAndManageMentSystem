package com.company.salestracker.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.company.salestracker.dto.request.ReportFilter;
import com.company.salestracker.dto.response.ReportResponse;
import com.company.salestracker.entity.User;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.repository.DealRepository;
import com.company.salestracker.repository.LeadRepository;
import com.company.salestracker.repository.SalesRepository;
import com.company.salestracker.service.ReportService;
import com.company.salestracker.util.AppCommon;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportServiceImpl implements ReportService {

	private final SalesRepository salesRepository;
	private final LeadRepository leadRepository;
	private final DealRepository dealRepository;
	private final AppCommon appCommon;

	private User getOwnerAdmin() {
		return appCommon.resolveOwnerAdmin(appCommon.currentLoginUser());
	}

	private LocalDateTime startOfDay(LocalDate date) {
		return date.atStartOfDay();
	}

	private LocalDateTime endOfDay(LocalDate date) {
		return date.atTime(23, 59, 59);
	}

	@Override
	public ReportResponse getSalesByUser(ReportFilter filter) {

		User ownerAdmin = getOwnerAdmin();

		if(filter.getEndDate().isBefore(filter.getStartDate())) {
			throw new BadRequestException("Start date must be before end date");
		}
		
		List<Object[]> result = salesRepository.getSalesByUser(ownerAdmin, filter.getStartDate(), filter.getEndDate());
		System.err.println("Get Sales By User === >  "+result);
		List<Map<String, Object>> data = result.stream()
				.map(row -> Map.of("userId", row[0], "userName", row[1], "totalSales", row[2], "totalDeals", row[3]))
				.toList();

		BigDecimal totalRevenue = result.stream().map(row -> (BigDecimal) row[2]).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		Long totalTransactions = result.stream().map(row -> (Long) row[3]).reduce(0L, Long::sum);

		return ReportResponse.builder().reportType("SALES_BY_USER").startDate(filter.getStartDate())
				.endDate(filter.getEndDate()).totalRevenue(totalRevenue).totalSales(totalTransactions).data(data)
				.build();
	}

	@Override
	public ReportResponse getSalesByPeriod(ReportFilter filter) {

		User ownerAdmin = getOwnerAdmin();

		if(filter.getEndDate().isBefore(filter.getStartDate())) {
			throw new BadRequestException("Start date must be before end date");
		}
		List<Object[]> result = salesRepository.getSalesByMonth(ownerAdmin, filter.getStartDate(), filter.getEndDate());

		List<Map<String, Object>> data = result.stream().map(row -> Map.of("month", row[0], "totalSales", row[1]))
				.toList();

		return ReportResponse.builder().reportType("SALES_BY_PERIOD").startDate(filter.getStartDate())
				.endDate(filter.getEndDate()).data(data).build();
	}

	@Override
	public ReportResponse getConversion(ReportFilter filter) {

		User ownerAdmin = getOwnerAdmin();
		if(filter.getEndDate().isBefore(filter.getStartDate())) {
			throw new BadRequestException("Start date must be before end date");
		}
		Long totalLeads = leadRepository.countLeadsBetweenDates(ownerAdmin, startOfDay(filter.getStartDate()),
				endOfDay(filter.getEndDate()));

		Long totalDeals = dealRepository.countDealsBetweenDates(ownerAdmin, startOfDay(filter.getStartDate()),
				endOfDay(filter.getEndDate()));

		double conversion = totalLeads == 0 ? 0 : (totalDeals.doubleValue() / totalLeads) * 100;

		return ReportResponse.builder().reportType("CONVERSION").startDate(filter.getStartDate())
				.endDate(filter.getEndDate()).totalLeads(totalLeads).totalDeals(totalDeals)
				.conversionPercentage(conversion).build();
	}

	@Override
	public ReportResponse getLostDealReport(ReportFilter filter) {

		User ownerAdmin = getOwnerAdmin();
		if(filter.getEndDate().isBefore(filter.getStartDate())) {
			throw new BadRequestException("Start date must be before end date");
		}
		Long count = dealRepository.countLostDeals(ownerAdmin, filter.getStartDate(), filter.getEndDate());

		BigDecimal amount = dealRepository.sumLostAmount(ownerAdmin, filter.getStartDate(), filter.getEndDate());

		BigDecimal avg = count == 0 ? BigDecimal.ZERO : amount.divide(BigDecimal.valueOf(count));

		return ReportResponse.builder().reportType("LOST_DEAL").startDate(filter.getStartDate())
				.endDate(filter.getEndDate()).totalLostDeals(count).totalLostRevenue(amount).averageLostDealValue(avg)
				.build();
	}

	@Override
	public ReportResponse getDashboardReport(ReportFilter filter) {

		User ownerAdmin = getOwnerAdmin();
		if(filter.getEndDate().isBefore(filter.getStartDate())) {
			throw new BadRequestException("Start date must be before end date");
		}
		BigDecimal totalRevenue = salesRepository.getTotalRevenue(ownerAdmin, filter.getStartDate(),
				filter.getEndDate());

		BigDecimal paidRevenue = salesRepository.getPaidRevenue(ownerAdmin, filter.getStartDate(), filter.getEndDate());

		BigDecimal pendingRevenue = salesRepository.getPendingRevenue(ownerAdmin, filter.getStartDate(),
				filter.getEndDate());

		Long totalLeads = leadRepository.countLeadsBetweenDates(ownerAdmin, startOfDay(filter.getStartDate()),
				endOfDay(filter.getEndDate()));

		Long totalDeals = dealRepository.countDealsBetweenDates(ownerAdmin, startOfDay(filter.getStartDate()),
				endOfDay(filter.getEndDate()));

		return ReportResponse.builder().reportType("DASHBOARD").startDate(filter.getStartDate())
				.endDate(filter.getEndDate()).totalLeads(totalLeads).totalDeals(totalDeals).totalRevenue(totalRevenue)
				.paidRevenue(paidRevenue).pendingRevenue(pendingRevenue).build();
	}
}

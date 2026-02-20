package com.company.salestracker.service;

import com.company.salestracker.dto.request.ReportFilter;
import com.company.salestracker.dto.response.ReportResponse;

public interface ReportService {

	ReportResponse getSalesByUser(ReportFilter filter);

	ReportResponse getSalesByPeriod(ReportFilter filter);

	ReportResponse getConversion(ReportFilter filter);

	ReportResponse getLostDealReport(ReportFilter filter);

	ReportResponse getDashboardReport(ReportFilter filter);
}

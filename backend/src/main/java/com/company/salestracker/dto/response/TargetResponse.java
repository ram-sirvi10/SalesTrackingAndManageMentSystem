package com.company.salestracker.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TargetResponse {

	private String id;
	private String userId;
	private String userEmail;
	private String userName;
	private Integer targetMonth;
	private Integer targetYear;
	private BigDecimal targetAmount;
	private BigDecimal achievedAmount;
	private BigDecimal achievementPercentage;
}

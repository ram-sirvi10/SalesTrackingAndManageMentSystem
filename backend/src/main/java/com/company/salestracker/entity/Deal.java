package com.company.salestracker.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "deals")
public class Deal extends BaseEntity{
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "lead_id" ,nullable = false)
	private Lead lead;
	
	@Enumerated(EnumType.STRING)
	private DealStage dealStage;
	
	@Column(nullable = false)
	private Double expectedAmount;
	
	@Column(nullable = false)
	private LocalDate closingDate;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "assigned_to")
	private User user;
}

package com.company.salestracker.entity;

import java.math.BigDecimal;
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
@Table(name = "sales")
public class Sale extends BaseEntity {

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "deal_id", nullable = false)
	private Deal deal;

	@Column(nullable = false)
	private BigDecimal saleAmount;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private PaymentStatus paymentStatus;

	@Column(nullable = false)
	private String invoiceNumber;

	@Column(nullable = false)
	private LocalDate saleDate;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "owner_admin")
	private User ownerAdmin;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "created_by")
	private User createdBy;

	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "commission_user")
	private User commissionUser;

}

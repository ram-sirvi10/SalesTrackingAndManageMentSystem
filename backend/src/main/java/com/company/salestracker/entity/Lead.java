package com.company.salestracker.entity;

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
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "leads")
public class Lead extends BaseEntity {

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String phone;

	@Column(nullable = false)
	private String source;

	@Enumerated(EnumType.STRING)
	private LeadStatus status;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "assigned_to")
	private User assignedto;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "owner_admin")
	private User ownerAdmin;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "created_by")
	private User createdBy;
}

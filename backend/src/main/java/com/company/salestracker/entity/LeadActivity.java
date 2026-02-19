package com.company.salestracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "lead_activites")
public class LeadActivity extends BaseEntity{
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "lead_id" ,nullable = false)
	private Lead lead;
	
	@Column(nullable = false)
	private String activityType;
	
	@Column(nullable = false)
	private String notes;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "created_by" ,nullable = false)
	private User createdBy;
	

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "owner_admin" ,nullable = false)
	private User ownerAdmin;
	

}

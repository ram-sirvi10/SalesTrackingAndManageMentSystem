package com.company.salestracker.entity;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "permissions")

public class Permission extends BaseEntity {
	
	@Column(name = "permission_code", unique = true)
	private String permissionCode;
	
	@Column(name = "description")
	private String description;

	


	
}

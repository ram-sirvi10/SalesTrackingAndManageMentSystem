package com.company.salestracker.entity;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@Table(name = "roles")
public class Role extends BaseEntity {

	@Column(nullable = false, unique = true)
	private String roleName;

	@Column(nullable = false)
	private String description;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "permission_id"))
	private Set<Permission> permissions;

	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "created_by")
	private User createdBy;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "owner_admin")
	private User ownerAdmin;
}

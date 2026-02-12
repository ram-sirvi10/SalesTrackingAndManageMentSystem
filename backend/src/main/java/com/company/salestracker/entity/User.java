package com.company.salestracker.entity;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import lombok.ToString;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder

@Table(name = "users")
public class User extends BaseEntity {

	@Column(nullable = false)
	private String name;

	@Column(unique = true, nullable = false)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String phone;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private UserStatus status;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
	    name = "user_roles",  
	    joinColumns = @JoinColumn(name = "user_id"),
	    inverseJoinColumns = @JoinColumn(name = "role_id")
	)
	private Set<Role> roles;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by")
	private User createdBy;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_admin")
	private User ownerAdmin;
}

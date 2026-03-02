package com.company.salestracker.runner;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.company.salestracker.entity.Permission;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.repository.PermissionRepository;
import com.company.salestracker.repository.RoleRepository;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.util.PermissionConstants;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Transactional
public class InitialRunner implements CommandLineRunner {

	private final UserRepository userRepo;
	private final PermissionRepository permissionRepo;
	private final RoleRepository roleRepo;
	private final BCryptPasswordEncoder encoder;

	@Override
	public void run(String... args) {

		// ==============================
		// ALL SYSTEM PERMISSIONS
		// ==============================
		// PERMISSION SEED DATA
		// ==============================
		List<Permission> permissions = List.of(

				// ==============================
				// USER MANAGEMENT
				// ==============================
				new Permission(PermissionConstants.CREATE_USER, "Create new user"),
				new Permission(PermissionConstants.UPDATE_USER, "Update user"),
				new Permission(PermissionConstants.DELETE_USER, "Delete user"),
				new Permission(PermissionConstants.APPROVE_USER, "Approve user"),
				new Permission(PermissionConstants.REJECT_USER, "Reject user"),
				new Permission(PermissionConstants.TOGGLE_USER_STATUS, "Activate/Deactivate user"),
				new Permission(PermissionConstants.VIEW_ALL_USERS, "View all users"),
				new Permission(PermissionConstants.VIEW_USERS_BY_ROLE, "View users by role"),
				new Permission(PermissionConstants.VIEW_PENDING_USERS, "View pending users"),

				// ==============================
				// ROLE MANAGEMENT
				// ==============================
				new Permission(PermissionConstants.CREATE_ROLE, "Create role"),
				new Permission(PermissionConstants.UPDATE_ROLE, "Update role"),
				new Permission(PermissionConstants.DELETE_ROLE, "Delete role"),
				new Permission(PermissionConstants.VIEW_ROLE, "View role details"),
				new Permission(PermissionConstants.VIEW_ROLES, "View all roles"),
				new Permission(PermissionConstants.VIEW_USER_ROLES, "View user roles"),
				new Permission(PermissionConstants.ASSIGN_ROLE, "Assign role to user"),
				new Permission(PermissionConstants.REMOVE_ROLE_FROM_USER, "Remove role from user"),
				new Permission(PermissionConstants.ADD_PERMISSION_TO_ROLE, "Add permission to role"),
				new Permission(PermissionConstants.REMOVE_PERMISSION_FROM_ROLE, "Remove permission from role"),

				// ==============================
				// LEAD MANAGEMENT
				// ==============================
				new Permission(PermissionConstants.CREATE_LEAD, "Create lead"),
				new Permission(PermissionConstants.UPDATE_LEAD, "Update lead"),
				new Permission(PermissionConstants.DELETE_LEAD, "Delete lead"),
				new Permission(PermissionConstants.ASSIGN_LEAD, "Assign lead"),
				new Permission(PermissionConstants.UPDATE_LEAD_STATUS, "Update lead status"),
				new Permission(PermissionConstants.GET_LEAD, "View lead details"),
				new Permission(PermissionConstants.VIEW_ALL_LEADS, "View all leads"),
				new Permission(PermissionConstants.VIEW_ASSIGNED_LEAD_OF_OTHER_USER,
						"View assigned leads of other users"),

				// ==============================
				// DEAL MANAGEMENT
				// ==============================
				new Permission(PermissionConstants.CREATE_DEAL, "Create deal"),
				new Permission(PermissionConstants.UPDATE_DEAL, "Update deal"),
				new Permission(PermissionConstants.DELETE_DEAL, "Delete deal"),
				new Permission(PermissionConstants.ASSIGN_DEAL, "Assign deal"),
				new Permission(PermissionConstants.UPDATE_DEAL_STAGE, "Update deal stage"),
				new Permission(PermissionConstants.GET_DEAL_BY_ID, "View deal details"),
				new Permission(PermissionConstants.VIEW_ALL_DEALS, "View all deals"),
				new Permission(PermissionConstants.VIEW_ASSIGNED_DEAL_OF_OTHER_USER,
						"View assigned deals of other users"),

				// ==============================
				// SALES MANAGEMENT
				// ==============================
				new Permission(PermissionConstants.CREATE_SALE, "Create sale"),
				new Permission(PermissionConstants.UPDATE_PAYMENT_STATUS, "Update payment status"),
				new Permission(PermissionConstants.GET_SALE_BY_ID, "View sale details"),
				new Permission(PermissionConstants.VIEW_ALL_SALES, "View all sales"),
				new Permission(PermissionConstants.VIEW_SALES_BY_USER, "View sales by user"),
				new Permission(PermissionConstants.VIEW_SALES_SUMMARY, "View sales summary"),

				// ==============================
				// TARGET MANAGEMENT
				// ==============================
				new Permission(PermissionConstants.CREATE_TARGET, "Create target"),
				new Permission(PermissionConstants.UPDATE_TARGET, "Update target"),
				new Permission(PermissionConstants.DELETE_TARGET, "Delete target"),
				new Permission(PermissionConstants.GET_TARGET_BY_ID, "View target details"),
				new Permission(PermissionConstants.VIEW_ALL_TARGETS, "View all targets"),
				new Permission(PermissionConstants.VIEW_TARGET_OF_OTHER_USER, "View target of other user"),
				new Permission(PermissionConstants.VIEW_TEAM_TARGET_PERFORMANCE, "View team target performance"),
				new Permission(PermissionConstants.VIEW_USER_TARGET_PERFORMANCE, "View user target performance"),

				// ==============================
				// REPORT MANAGEMENT
				// ==============================
				new Permission(PermissionConstants.VIEW_SALES_REPORT, "View sales report"),
				new Permission(PermissionConstants.VIEW_CONVERSION_REPORT, "View conversion report"),
				new Permission(PermissionConstants.VIEW_LOST_DEAL_REPORT, "View lost deal report"),
				new Permission(PermissionConstants.VIEW_DASHBOARD_REPORT, "View dashboard report"));

		// ==============================
		// SAVE ONLY MISSING PERMISSIONS
		// ==============================
		Set<String> existingCodes = permissionRepo.findAll().stream().map(Permission::getPermissionCode)
				.collect(Collectors.toSet());

		List<Permission> newPermissions = permissions.stream()
				.filter(p -> !existingCodes.contains(p.getPermissionCode())).toList();

		if (!newPermissions.isEmpty()) {
			permissionRepo.saveAll(newPermissions);
		}

		// ==============================
		// SUPER ADMIN ROLE
		// ==============================
		String roleName = "ROLE_SUPER_ADMIN";

		Role superAdminRole = roleRepo.findByRoleNameAndIsDeleteFalse(roleName)
				.orElseGet(() -> roleRepo.save(new Role(roleName, "Full system access", new HashSet<>(), null, null)));

		Set<Permission> allPermissions = new HashSet<>(permissionRepo.findAll());

		superAdminRole.getPermissions().addAll(allPermissions);
		roleRepo.save(superAdminRole);

		// ==============================
		// SUPER ADMIN USER
		// ==============================
		String email = "ramsirvi10@gmail.com";

		if (userRepo.findByEmail(email).isEmpty()) {

			User superAdmin = User.builder().name("Ram Sirvi").email(email).phone("9999999999")
					.password(encoder.encode("Ram@123")).roles(Set.of(superAdminRole)).status(UserStatus.ACTIVE)
					.build();

			userRepo.save(superAdmin);
		}
	}
}

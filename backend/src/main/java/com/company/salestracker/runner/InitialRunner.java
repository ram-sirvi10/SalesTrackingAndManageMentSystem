package com.company.salestracker.runner;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.company.salestracker.constants.PermissionConstants;
import com.company.salestracker.entity.Permission;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.repository.PermissionRepository;
import com.company.salestracker.repository.RoleRepository;
import com.company.salestracker.repository.UserRepository;

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
		        new Permission(PermissionConstants.USER_CREATE, "Create new user"),
		        new Permission(PermissionConstants.USER_UPDATE, "Update user"),
		        new Permission(PermissionConstants.USER_DELETE, "Delete user"),
		        new Permission(PermissionConstants.USER_VIEW, "View users"),
		        new Permission(PermissionConstants.USER_APPROVE, "Approve or reject user"),
		        new Permission(PermissionConstants.USER_STATUS_UPDATE, "Activate or deactivate user"),

		        // ==============================
		        // ROLE MANAGEMENT
		        // ==============================
		        new Permission(PermissionConstants.ROLE_CREATE, "Create role"),
		        new Permission(PermissionConstants.ROLE_UPDATE, "Update role"),
		        new Permission(PermissionConstants.ROLE_DELETE, "Delete role"),
		        new Permission(PermissionConstants.ROLE_VIEW, "View roles"),
		        new Permission(PermissionConstants.ROLE_ASSIGN, "Assign role to user"),
		        new Permission(PermissionConstants.ROLE_REMOVE, "Remove role from user"),

		        // ==============================
		        // PERMISSION MANAGEMENT
		        // ==============================
		        new Permission(PermissionConstants.PERMISSION_VIEW, "View permissions"),
		        new Permission(PermissionConstants.PERMISSION_ASSIGN, "Assign permissions to role"),
		        new Permission(PermissionConstants.PERMISSION_REMOVE, "Remove permission from role"),

		        // ==============================
		        // LEAD MANAGEMENT
		        // ==============================
		        new Permission(PermissionConstants.LEAD_CREATE, "Create lead"),
		        new Permission(PermissionConstants.LEAD_UPDATE, "Update lead"),
		        new Permission(PermissionConstants.LEAD_DELETE, "Delete lead"),
		        new Permission(PermissionConstants.LEAD_VIEW, "View leads"),
		        new Permission(PermissionConstants.LEAD_VIEW_ALL, "View leads"),
		        new Permission(PermissionConstants.LEAD_ASSIGN, "Assign lead"),
		        new Permission(PermissionConstants.LEAD_STATUS_UPDATE, "Update lead status"),

		        // ==============================
		        // DEAL MANAGEMENT
		        // ==============================
		        new Permission(PermissionConstants.DEAL_CREATE, "Create deal"),
		        new Permission(PermissionConstants.DEAL_UPDATE, "Update deal"),
		        new Permission(PermissionConstants.DEAL_DELETE, "Delete deal"),
		        new Permission(PermissionConstants.DEAL_VIEW, "View deals"),
		        new Permission(PermissionConstants.DEAL_VIEW_ALL, "View leads"),
		        new Permission(PermissionConstants.DEAL_ASSIGN, "Assign deal"),
		        new Permission(PermissionConstants.DEAL_STAGE_UPDATE, "Update deal stage"),

		        // ==============================
		        // SALES MANAGEMENT
		        // ==============================
		        new Permission(PermissionConstants.SALE_CREATE, "Create sale"),
		        new Permission(PermissionConstants.SALE_VIEW, "View sales"),
		        new Permission(PermissionConstants.SALE_VIEW_ALL, "View sales"),
		        new Permission(PermissionConstants.SALE_PAYMENT_UPDATE, "Update payment status"),
		        new Permission(PermissionConstants.SALE_SUMMARY_VIEW, "View sales summary"),

		        // ==============================
		        // TARGET MANAGEMENT
		        // ==============================
		        new Permission(PermissionConstants.TARGET_CREATE, "Create target"),
		        new Permission(PermissionConstants.TARGET_UPDATE, "Update target"),
		        new Permission(PermissionConstants.TARGET_DELETE, "Delete target"),
		        new Permission(PermissionConstants.TARGET_VIEW, "View targets"),
		        new Permission(PermissionConstants.TARGET_VIEW_ALL, "View targets"),
		        new Permission(PermissionConstants.TARGET_TEAM_PERFORMANCE, "View team target performance"),
		        new Permission(PermissionConstants.TARGET_USER_PERFORMANCE, "View user target performance"),

		        // ==============================
		        // REPORT MANAGEMENT
		        // ==============================
		        new Permission(PermissionConstants.REPORT_VIEW, "View reports"),
		        new Permission(PermissionConstants.REPORT_SALES, "View sales report"),
		        new Permission(PermissionConstants.REPORT_CONVERSION, "View conversion report"),
		        new Permission(PermissionConstants.REPORT_LOST_DEALS, "View lost deals report"),
		        new Permission(PermissionConstants.REPORT_DASHBOARD, "View dashboard report")
		);
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

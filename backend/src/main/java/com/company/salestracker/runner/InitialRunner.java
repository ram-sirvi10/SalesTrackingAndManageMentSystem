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
import com.company.salestracker.util.PermissionCodeConstants;

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
		List<Permission> permissions = List.of(

				// USER
				new Permission(PermissionCodeConstants.CREATE_USER, "Create new user"),
				new Permission(PermissionCodeConstants.READ_USER, "View user"),
				new Permission(PermissionCodeConstants.UPDATE_PROFILE, "Update own profile"),
				new Permission(PermissionCodeConstants.UPDATE_USER, "Update user"),
				new Permission(PermissionCodeConstants.DELETE_USER, "Delete user"),
				new Permission(PermissionCodeConstants.APPROVE_USER, "Approve user"),
				new Permission(PermissionCodeConstants.REJECT_USER, "Reject user"),
				new Permission(PermissionCodeConstants.TOGGLE_USER_STATUS, "Activate/Deactivate user"),
				new Permission(PermissionCodeConstants.VIEW_ALL_USERS, "View all users"),
				new Permission(PermissionCodeConstants.VIEW_USERS_BY_ADMIN, "View users by admin"),
				new Permission(PermissionCodeConstants.VIEW_USERS_BY_ROLE, "View users by role"),
				new Permission(PermissionCodeConstants.VIEW_PENDING_USERS, "View pending users"),
				new Permission(PermissionCodeConstants.VIEW_SUPER_ADMINS, "View super admins"),
				new Permission(PermissionCodeConstants.VIEW_ADMINS, "View admins"),

				// ROLE
				new Permission(PermissionCodeConstants.CREATE_ROLE, "Create role"),
				new Permission(PermissionCodeConstants.VIEW_ROLE, "View role"),
				new Permission(PermissionCodeConstants.UPDATE_ROLE, "Update role"),
				new Permission(PermissionCodeConstants.DELETE_ROLE, "Delete role"),
				new Permission(PermissionCodeConstants.ASSIGN_ROLE, "Assign role"),
				new Permission(PermissionCodeConstants.REMOVE_ROLE_FROM_USER, "Remove role"),
				new Permission(PermissionCodeConstants.ADD_PERMISSION_TO_ROLE, "Add permission"),
				new Permission(PermissionCodeConstants.REMOVE_PERMISSION_FROM_ROLE, "Remove permission"),
				new Permission(PermissionCodeConstants.GET_ROLES_BY_ADMIN, "View roles by admin"),
				new Permission(PermissionCodeConstants.VIEW_ROLES, "View roles"),
				new Permission(PermissionCodeConstants.VIEW_USER_ROLES, "View user roles"),

				// LEAD
				new Permission(PermissionCodeConstants.CREATE_LEAD, "Create lead"),
				new Permission(PermissionCodeConstants.UPDATE_LEAD, "Update lead"),
				new Permission(PermissionCodeConstants.DELETE_LEAD, "Delete lead"),
				new Permission(PermissionCodeConstants.ASSIGN_LEAD, "Assign lead"),
				new Permission(PermissionCodeConstants.UPDATE_LEAD_STATUS, "Update lead status"),
				new Permission(PermissionCodeConstants.VIEW_ALL_LEADS, "View all leads"),
				new Permission(PermissionCodeConstants.VIEW_ASSIGNED_LEADS, "View assigned leads"),
				new Permission(PermissionCodeConstants.VIEW_ASSIGNED_LEAD_OF_OTHER_USER,
						"View assigned leads of users"),
				new Permission(PermissionCodeConstants.VIEW_LEAD_DETAILS, "View lead details"),
				new Permission(PermissionCodeConstants.VIEW_LEAD_ACTIVITY, "View lead activity"),

				// DEAL
				new Permission(PermissionCodeConstants.CREATE_DEAL, "Create deal"),
				new Permission(PermissionCodeConstants.UPDATE_DEAL, "Update deal"),
				new Permission(PermissionCodeConstants.DELETE_DEAL, "Delete deal"),
				new Permission(PermissionCodeConstants.ASSIGN_DEAL, "Assign deal"),
				new Permission(PermissionCodeConstants.UPDATE_DEAL_STAGE, "Update deal stage"),
				new Permission(PermissionCodeConstants.VIEW_ALL_DEALS, "View all deals"),
				new Permission(PermissionCodeConstants.VIEW_ASSIGNED_DEAL_OF_OTHER_USER, "View assigned deals"),
				new Permission(PermissionCodeConstants.GET_DEAL_BY_ID, "View deal details"),

				// SALES
				new Permission(PermissionCodeConstants.CREATE_SALE, "Create sale"),
				new Permission(PermissionCodeConstants.UPDATE_SALE, "Update sale"),
				new Permission(PermissionCodeConstants.DELETE_SALE, "Delete sale"),
				new Permission(PermissionCodeConstants.VIEW_ALL_SALES, "View all sales"),
				new Permission(PermissionCodeConstants.VIEW_SALES_OF_OTHER_USER, "View sales of other user"),
				new Permission(PermissionCodeConstants.GET_SALE_BY_ID, "View sale details"),
				new Permission(PermissionCodeConstants.VIEW_SALES_SUMMARY, "View sales summary"),

				// TARGET
				new Permission(PermissionCodeConstants.CREATE_TARGET, "Create target"),
				new Permission(PermissionCodeConstants.UPDATE_TARGET, "Update target"),
				new Permission(PermissionCodeConstants.DELETE_TARGET, "Delete target"),
				new Permission(PermissionCodeConstants.VIEW_ALL_TARGETS, "View all targets"),
				new Permission(PermissionCodeConstants.VIEW_TARGET_OF_OTHER_USER, "View target of other user"),

				// REPORT
				new Permission(PermissionCodeConstants.VIEW_SALES_REPORT, "View sales report"),
				new Permission(PermissionCodeConstants.VIEW_CONVERSION_REPORT, "View conversion report"),
				new Permission(PermissionCodeConstants.VIEW_LOST_DEAL_REPORT, "View lost deal report"),
				new Permission(PermissionCodeConstants.VIEW_DASHBOARD_REPORT, "View dashboard report"),

				// AUDIT
				new Permission(PermissionCodeConstants.VIEW_AUDIT_LOGS, "View audit logs"));

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

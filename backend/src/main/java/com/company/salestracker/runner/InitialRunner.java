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

		List<Permission> permissions = List.of(

				// ==============================
				// USER MANAGEMENT
				// ==============================
				new Permission("CREATE_USER", "Create new user"), new Permission("READ_USER", "View user"),
				new Permission("UPDATE_PROFILE", "update own profile"),
				new Permission("UPDATE_USER", "Update other  user profile"),
				new Permission("DELETE_USER", "Delete user"), new Permission("APPROVE_USER", "Approve user request"),
				new Permission("REJECT_USER", "Reject user request"),
				new Permission("TOGGLE_USER_STATUS", "Activate/Deactivate user"),
				new Permission("VIEW_ALL_USERS", "View all users"),
				new Permission("VIEW_USERS_BY_ADMIN", "View users under admin"),
				new Permission("VIEW_USERS_BY_ROLE", "View users by role"),
				new Permission("VIEW_PENDING_USERS", "View pending users"),
				new Permission("VIEW_SUPER_ADMINS", "View super admins"),
				new Permission("VIEW_ADMINS", "View owner admins"),

				// ==============================
				// ROLE MANAGEMENT
				// ==============================
				new Permission("CREATE_ROLE", "Create role"), new Permission("VIEW_ROLE", "View role"),
				new Permission("UPDATE_ROLE", "Update role"), new Permission("DELETE_ROLE", "Delete role"),
				new Permission("ASSIGN_ROLE", "Assign role to user"),
				new Permission("REMOVE_ROLE_FROM_USER", "Remove role from user"),
				new Permission("ADD_PERMISSION_TO_ROLE", "Add permission to role"),
				new Permission("REMOVE_PERMISSION_FROM_ROLE", "Remove permission from role"),
				new Permission("GET_ROLES_BY_ADMIN", "View roles by admin"),
				new Permission("VIEW_ROLES", "View  roles"), new Permission("VIEW_USER_ROLES", "View roles of user"),

				// ==============================
				// LEAD MANAGEMENT
				// ==============================
				new Permission("CREATE_LEAD", "Create new lead"), new Permission("UPDATE_LEAD", "Update lead details"),
				new Permission("DELETE_LEAD", "Delete lead"), new Permission("ASSIGN_LEAD", "Assign lead to user"),
				new Permission("UPDATE_LEAD_STATUS", "Update lead status"),
				new Permission("VIEW_ALL_LEADS", "View all leads"),
				new Permission("VIEW_ASSIGNED_LEADS", "View assigned leads"),
				new Permission("VIEW_LEAD_DETAILS", "View lead details"),
				new Permission("VIEW_LEAD_ACTIVITY", "View lead activity timeline")

		);

		// Save missing permissions
		Set<String> existingCodes = permissionRepo.findAll().stream().map(Permission::getPermissionCode)
				.collect(Collectors.toSet());

		List<Permission> newPermissions = permissions.stream()
				.filter(p -> !existingCodes.contains(p.getPermissionCode())).toList();

		if (!newPermissions.isEmpty()) {
			permissionRepo.saveAll(newPermissions);
		}

		Set<Permission> savedPermissions = new HashSet<>(permissionRepo.findAll());

		// SUPER ADMIN ROLE
		String roleName = "ROLE_SUPER_ADMIN";

		Role superAdminRole = roleRepo.findByRoleNameAndIsDeleteFalse(roleName)
				.orElseGet(() -> roleRepo.save(new Role(roleName, "Full system access", new HashSet<>(), null, null)));

		// Always give full permissions
		superAdminRole.getPermissions().addAll(savedPermissions);
		roleRepo.save(superAdminRole);

		// SUPER ADMIN USER
		String email = "superadmin@gmail.com";

		if (userRepo.findByEmail(email).isEmpty()) {

			User superAdmin = User.builder().name("Super Admin").email(email).phone("9999999999")
					.password(encoder.encode("Super@123")).roles(Set.of(superAdminRole)).status(UserStatus.ACTIVE)
					.build();

			userRepo.save(superAdmin);
		}
	}
}

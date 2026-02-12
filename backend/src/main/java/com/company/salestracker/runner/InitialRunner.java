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

				// USER
				new Permission("CREATE_USER", "Create new user"), new Permission("READ_USER", "View user"),
				new Permission("UPDATE_USER", "Update user"), new Permission("DELETE_USER", "Delete user"),

				// ROLE
				new Permission("CREATE_ROLE", "Create role"), new Permission("VIEW_ROLE", "View role"),
				new Permission("UPDATE_ROLE", "Update role"), new Permission("DELETE_ROLE", "Delete role"),
				new Permission("ASSIGN_ROLE", "Assign role to user"),
				new Permission("REMOVE_ROLE_FROM_USER", "Remove role from user"),

				// ROLE PERMISSIONS
				new Permission("ADD_PERMISSION_TO_ROLE", "Add permission to role"),
				new Permission("REMOVE_PERMISSION_FROM_ROLE", "Remove permission from role"),

				// ROLE VIEW
				new Permission("GET_ROLES_BY_ADMIN", "View roles by admin"),
				new Permission("VIEW_DEFAULT_ROLE", "View default roles"),
				new Permission("VIEW_USER_ROLES", "View roles of user"));

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

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

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InitialRunner implements CommandLineRunner {

	private final UserRepository userRepo;
	private final PermissionRepository permissionRepo;
	private final RoleRepository roleRepo;
	private final BCryptPasswordEncoder encoder;

	@Override
	public void run(String... args) {

		List<Permission> permissions = List.of(new Permission("CREATE_USER", "Create new user"),
				new Permission("READ_USER", "View user details"), new Permission("UPDATE_USER", "Update user details"),
				new Permission("DELETE_USER", "Delete user"), new Permission("CREATE_ROLE", "Create new role"),
				new Permission("READ_ROLE", "View role details"), new Permission("UPDATE_ROLE", "Update role"),
				new Permission("DELETE_ROLE", "Delete role"), new Permission("ASSIGN_ROLE", "Assign role to user"));

		List<Permission> existingPermissions = permissionRepo.findAll();

		Set<String> existingCodes = existingPermissions.stream().map(Permission::getPermissionCode)
				.collect(Collectors.toSet());

		List<Permission> newPermissions = permissions.stream()
				.filter(p -> !existingCodes.contains(p.getPermissionCode())).toList();

		if (!newPermissions.isEmpty()) {
			permissionRepo.saveAll(newPermissions);
		}

		Set<Permission> savedPermissions = new HashSet<>(permissionRepo.findAll());

		String roleName = "ROLE_SUPER_ADMIN";

		if (roleRepo.findByRoleName(roleName).isEmpty()) {

			Role role = new Role(roleName, "Highest level administrative role with full system access",
					savedPermissions, null, null);

			roleRepo.save(role);
		}

		String superAdminEmail = "superadmin@gmail.com";

		if (userRepo.findByEmail(superAdminEmail).isEmpty()) {

			User superAdmin = User.builder().name("Super Admin").email(superAdminEmail).phone("9999999999")
					.password(encoder.encode("Super@123")).status(UserStatus.ACTIVE).build();

			userRepo.save(superAdmin);
		}
	}
}
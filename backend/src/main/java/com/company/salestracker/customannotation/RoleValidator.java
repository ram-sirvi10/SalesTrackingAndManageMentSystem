package com.company.salestracker.customannotation;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.company.salestracker.entity.User;
import com.company.salestracker.repository.RoleRepository;
import com.company.salestracker.repository.UserRepository;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RoleValidator implements ConstraintValidator<ValidRoles, Set<String>> {

	@Autowired
	private UserRepository userRepo;
	@Autowired
	private RoleRepository roleRepo;

	private User currentLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return userRepo.findByEmail(authentication.getName()).orElseThrow();
	}

	@Override
	public boolean isValid(Set<String> roles, ConstraintValidatorContext context) {
		if (roles == null || roles.isEmpty()) {
			return false;
		}

		User currentLoginUser = currentLoginUser();
		Set<String> allowedRoles = new HashSet<String>();
		if (currentLoginUser != null && currentLoginUser.getOwnerAdmin() != null)
			allowedRoles = new HashSet<>(roleRepo.findByOwnerAdmin(currentLoginUser.getOwnerAdmin())).stream()
					.map(role -> role.getId()).collect(Collectors.toSet());
		else if (currentLoginUser != null && currentLoginUser.getOwnerAdmin() != null)
			allowedRoles = new HashSet<>(roleRepo.findByOwnerAdminIsNull()).stream().map(role -> role.getId())
					.collect(Collectors.toSet());
		return roles.stream().allMatch(allowedRoles::contains);
	}

}

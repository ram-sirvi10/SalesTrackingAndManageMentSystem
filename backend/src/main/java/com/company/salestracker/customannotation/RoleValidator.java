package com.company.salestracker.customannotation;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import com.company.salestracker.repository.RoleRepository;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


public class RoleValidator implements ConstraintValidator<ValidRoles, Set<String>> {

	@Autowired
	private RoleRepository roleRepo;

	@Override
	public boolean isValid(Set<String> roles, ConstraintValidatorContext context) {
	    if (roles == null || roles.isEmpty()) {
	        return false;
	    }
	    roleRepo.findAllIds();

	    Set<String> allowedRoles = new HashSet<>( roleRepo.findAllIds());

	    return roles.stream()
	                .allMatch(allowedRoles::contains);
	}

}

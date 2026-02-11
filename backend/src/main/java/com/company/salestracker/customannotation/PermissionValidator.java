package com.company.salestracker.customannotation;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import com.company.salestracker.service.PermissionService;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PermissionValidator  implements ConstraintValidator<ValidRoles, Set<String>> {

	@Autowired
	private PermissionService permissionService;
	 
	
	@Override
	public boolean isValid(Set<String> permisisons, ConstraintValidatorContext context) {
	    if (permisisons == null || permisisons.isEmpty()) {
	        return false;
	    }
	    

	    Set<String> allowedPermissions = new HashSet<String>(permissionService.getAllPermissionIds());

	    return permisisons.stream()
	                .allMatch(allowedPermissions::contains);
	}

}
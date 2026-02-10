package com.company.salestracker.customannotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;

@Documented
@Constraint(validatedBy = PermissionValidator.class) 
@Target( ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPermission {
	 String message() default "One or more permissions invalid";  
}

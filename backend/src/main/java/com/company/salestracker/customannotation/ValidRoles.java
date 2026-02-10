package com.company.salestracker.customannotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;

@Documented
@Constraint(validatedBy = RoleValidator.class) 
@Target( ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRoles {
    
    String message() default "One or more roles invalid";  
   
}

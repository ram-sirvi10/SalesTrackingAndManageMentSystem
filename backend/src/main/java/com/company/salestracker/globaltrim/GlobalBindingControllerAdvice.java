package com.company.salestracker.globaltrim;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalBindingControllerAdvice {

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		System.err.println("GlobalBindingControllerAdvice");
		binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
	}
}

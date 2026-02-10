package com.company.salestracker.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.company.salestracker.dto.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException ex) {
	return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage(), HttpStatus.BAD_REQUEST.name()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
	return ResponseEntity.status(HttpStatus.NOT_FOUND)
		.body(ApiResponse.error(ex.getMessage(), HttpStatus.NOT_FOUND.name()));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
	return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
		.body(ApiResponse.error(ex.getMessage(), HttpStatus.METHOD_NOT_ALLOWED.name()));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleMissingParams(
	    MissingServletRequestParameterException ex) {

	Map<String, String> details = new HashMap<>();
	details.put(ex.getParameterName(), "Parameter is missing");

	return ResponseEntity.badRequest()
		.body(ApiResponse.error("Missing request parameter", HttpStatus.BAD_REQUEST.name(), details));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
	    MethodArgumentNotValidException ex) {

	Map<String, String> errors = new HashMap<>();
	ex.getBindingResult().getFieldErrors()
		.forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

	return ResponseEntity.badRequest()
		.body(ApiResponse.error("Validation failed", HttpStatus.BAD_REQUEST.name(), errors));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {

	String message = "Invalid value for parameter '" + ex.getName() + "'. Expected type: "
		+ ex.getRequiredType().getSimpleName();

	return ResponseEntity.badRequest().body(ApiResponse.error(message, HttpStatus.BAD_REQUEST.name()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidJson(HttpMessageNotReadableException ex) {
	return ResponseEntity.badRequest()
		.body(ApiResponse.error("Request body is missing or malformed JSON", HttpStatus.BAD_REQUEST.name()));
    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
//	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//		.body(ApiResponse.error("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR.name()));
//    }
}

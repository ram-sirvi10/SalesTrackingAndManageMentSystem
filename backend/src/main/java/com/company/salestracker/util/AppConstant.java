package com.company.salestracker.util;

public class AppConstant {

	// ===================VALIDATION REGEX===============
	public static final String VALID_USERNAME_REGEX = "^[A-Za-z][A-Za-z]*\\s?[A-Za-z]+$";
	public static final String VALID_EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
	public static final String VALID_PASSWORD_REGEX = "^[^\\s]{6,}$";

	public static final String VALID_CATEGORY_REGEX = "^[A-Za-z]+$";
	public static final String VALID_PHONE_REGEX = "^\\+?[6-9][0-9]{9,14}$";
	public static final String DESCRIPTION_MIN_10_WORDS_REGEX = "^(\\s*\\S+){10,}\\s*$";
	public static final String VALID_ROLE_REGEX = "^[A-Za-z]+(_[A-Za-z]+)*$";
	// ======================User Request Validation Constants =============

	public final static String USERNAME_ERROR = "Username invalid special character and more than one space in middile not allowed and no space allowed in start and end";
	public final static String USERNAME_NOT_BLANK = "User name cannot be blank";
	public final static String EMAIL_ERROR = "Email invalid , enter valid email id ";
	public final static String EMAIL_NOT_BLANK = "Email cannot be blank";
	public final static String PASSWORD_ERROR = "Invalid Password, Password must be at least 6 characters and no space allowed";
	public final static String PASSWORD_NOT_BLANK = "Password cannot be blank";
	public static final String PHONE_NOT_BLANK = "Phone number must not be blank";
	public static final String PHONE_ERROR = "Invalid phone number format";
	public static final String USER_NOT_FOUND = "User not found !";
	public static final String EMAIL_ALREADY_EXIST = "Email already exist";

	public static final String INVALID_CREDENTIAL = "Invalid Creadiantial";
	public static final String ROLES_NOT_BLANK = "Roles must not be blank";
	public static final String ROLES_INVALID = "One or more roles invalid";
	public static final String PHONE_ALREADY_EXIST = "Phone already exist";
	public static final String USER_IS_BLOCKED = "User is temporary blocked";
	public static final String INAVLID_REFRESH_TOKEN = "Invalid Refresh Token ";
	public static final String TOKEN_EXPIRE = "Token is Expired";
	public static final String ROLE_ALREADY_EXIXT = "Role already exist";
	public static final String USERID_NOT_BLANK = "User id not be blank";
	
	public static final String ROLE_NAME_NOT_BLANK = "Role name must not be blank";

	public static final String ROLE_ERROR = "Role name must contain only alphabets and underscore";


}

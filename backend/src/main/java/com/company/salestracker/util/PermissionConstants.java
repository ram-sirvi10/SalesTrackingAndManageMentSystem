package com.company.salestracker.util;

public final class PermissionConstants {

	private PermissionConstants() {
	}

	// ==============================
	// USER MANAGEMENT
	// ==============================
	public static final String CREATE_USER = "CREATE_USER";
	public static final String UPDATE_USER = "UPDATE_USER";
	public static final String DELETE_USER = "DELETE_USER";
	public static final String APPROVE_USER = "APPROVE_USER";
	public static final String REJECT_USER = "REJECT_USER";
	public static final String TOGGLE_USER_STATUS = "TOGGLE_USER_STATUS";
	public static final String VIEW_ALL_USERS = "VIEW_ALL_USERS";
	public static final String VIEW_USERS_BY_ROLE = "VIEW_USERS_BY_ROLE";
	public static final String VIEW_PENDING_USERS = "VIEW_PENDING_USERS";

	// ==============================
	// ROLE MANAGEMENT
	// ==============================
	public static final String CREATE_ROLE = "CREATE_ROLE";
	public static final String UPDATE_ROLE = "UPDATE_ROLE";
	public static final String DELETE_ROLE = "DELETE_ROLE";
	public static final String VIEW_ROLE = "VIEW_ROLE";
	public static final String VIEW_ROLES = "VIEW_ROLES";
	public static final String VIEW_USER_ROLES = "VIEW_USER_ROLES";
	public static final String ASSIGN_ROLE = "ASSIGN_ROLE";
	public static final String REMOVE_ROLE_FROM_USER = "REMOVE_ROLE_FROM_USER";
	public static final String ADD_PERMISSION_TO_ROLE = "ADD_PERMISSION_TO_ROLE";
	public static final String REMOVE_PERMISSION_FROM_ROLE = "REMOVE_PERMISSION_FROM_ROLE";

	// ==============================
	// PERMISSION MANAGEMENT
	// ==============================
	public static final String VIEW_ALL_PERMISSIONS = "VIEW_ALL_PERMISSIONS";
	public static final String VIEW_ALL_PERMISSIONS_BY_ROLE = "VIEW_ALL_PERMISSIONS_BY_ROLE";
	public static final String VIEW_ALL_PERMISSIONS_BY_USER = "VIEW_ALL_PERMISSIONS_BY_USER";

	// ==============================
	// LEAD MANAGEMENT
	// ==============================
	public static final String CREATE_LEAD = "CREATE_LEAD";
	public static final String UPDATE_LEAD = "UPDATE_LEAD";
	public static final String DELETE_LEAD = "DELETE_LEAD";
	public static final String ASSIGN_LEAD = "ASSIGN_LEAD";
	public static final String UPDATE_LEAD_STATUS = "UPDATE_LEAD_STATUS";
	public static final String GET_LEAD = "GET_LEAD";
	public static final String VIEW_ALL_LEADS = "VIEW_ALL_LEADS";
	public static final String VIEW_ASSIGNED_LEAD_OF_OTHER_USER = "VIEW_ASSIGNED_LEAD_OF_OTHER_USER";

	// ==============================
	// DEAL MANAGEMENT
	// ==============================
	public static final String CREATE_DEAL = "CREATE_DEAL";
	public static final String UPDATE_DEAL = "UPDATE_DEAL";
	public static final String DELETE_DEAL = "DELETE_DEAL";
	public static final String ASSIGN_DEAL = "ASSIGN_DEAL";
	public static final String UPDATE_DEAL_STAGE = "UPDATE_DEAL_STAGE";
	public static final String GET_DEAL_BY_ID = "GET_DEAL_BY_ID";
	public static final String VIEW_ALL_DEALS = "VIEW_ALL_DEALS";
	public static final String VIEW_ASSIGNED_DEAL_OF_OTHER_USER = "VIEW_ASSIGNED_DEAL_OF_OTHER_USER";

	// ==============================
	// SALES MANAGEMENT
	// ==============================
	public static final String CREATE_SALE = "CREATE_SALE";
	public static final String UPDATE_PAYMENT_STATUS = "UPDATE_PAYMENT_STATUS";
	public static final String GET_SALE_BY_ID = "GET_SALE_BY_ID";
	public static final String VIEW_ALL_SALES = "VIEW_ALL_SALES";
	public static final String VIEW_SALES_BY_USER = "VIEW_SALES_BY_USER";
	public static final String VIEW_SALES_SUMMARY = "VIEW_SALES_SUMMARY";

	// ==============================
	// TARGET MANAGEMENT
	// ==============================
	public static final String CREATE_TARGET = "CREATE_TARGET";
	public static final String UPDATE_TARGET = "UPDATE_TARGET";
	public static final String DELETE_TARGET = "DELETE_TARGET";
	public static final String GET_TARGET_BY_ID = "GET_TARGET_BY_ID";
	public static final String VIEW_ALL_TARGETS = "VIEW_ALL_TARGETS";
	public static final String VIEW_TARGET_OF_OTHER_USER = "VIEW_TARGET_OF_OTHER_USER";
	public static final String VIEW_TEAM_TARGET_PERFORMANCE = "VIEW_TEAM_TARGET_PERFORMANCE";
	public static final String VIEW_USER_TARGET_PERFORMANCE = "VIEW_USER_TARGET_PERFORMANCE";

	// ==============================
	// REPORT MANAGEMENT
	// ==============================
	public static final String VIEW_SALES_REPORT = "VIEW_SALES_REPORT";
	public static final String VIEW_CONVERSION_REPORT = "VIEW_CONVERSION_REPORT";
	public static final String VIEW_LOST_DEAL_REPORT = "VIEW_LOST_DEAL_REPORT";
	public static final String VIEW_DASHBOARD_REPORT = "VIEW_DASHBOARD_REPORT";
}
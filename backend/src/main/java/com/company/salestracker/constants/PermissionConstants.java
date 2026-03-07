package com.company.salestracker.constants;

public final class PermissionConstants {

    private PermissionConstants() {}

    // ==============================
    // USER MANAGEMENT
    // ==============================

    public static final String USER_CREATE = "USER_CREATE";
    public static final String USER_UPDATE = "USER_UPDATE";
    public static final String USER_DELETE = "USER_DELETE";
    public static final String USER_VIEW = "USER_VIEW";
    public static final String USER_APPROVE = "USER_APPROVE";
    public static final String USER_STATUS_UPDATE = "USER_STATUS_UPDATE";


    // ==============================
    // ROLE MANAGEMENT
    // ==============================

    public static final String ROLE_CREATE = "ROLE_CREATE";
    public static final String ROLE_UPDATE = "ROLE_UPDATE";
    public static final String ROLE_DELETE = "ROLE_DELETE";
    public static final String ROLE_VIEW = "ROLE_VIEW";
    public static final String ROLE_ASSIGN = "ROLE_ASSIGN";
    public static final String ROLE_REMOVE = "ROLE_REMOVE";


    // ==============================
    // PERMISSION MANAGEMENT
    // ==============================

    public static final String PERMISSION_VIEW = "PERMISSION_VIEW";
    public static final String PERMISSION_ASSIGN = "PERMISSION_ASSIGN";
    public static final String PERMISSION_REMOVE = "PERMISSION_REMOVE";


    // ==============================
    // LEAD MANAGEMENT
    // ==============================

    public static final String LEAD_CREATE = "LEAD_CREATE";
    public static final String LEAD_UPDATE = "LEAD_UPDATE";
    public static final String LEAD_DELETE = "LEAD_DELETE";
    public static final String LEAD_VIEW = "LEAD_VIEW";
    public static final String LEAD_VIEW_ALL = "LEAD_VIEW_ALL";
    public static final String LEAD_ASSIGN = "LEAD_ASSIGN";
    public static final String LEAD_STATUS_UPDATE = "LEAD_STATUS_UPDATE";


    // ==============================
    // DEAL MANAGEMENT
    // ==============================

    public static final String DEAL_CREATE = "DEAL_CREATE";
    public static final String DEAL_UPDATE = "DEAL_UPDATE";
    public static final String DEAL_DELETE = "DEAL_DELETE";
    public static final String DEAL_VIEW = "DEAL_VIEW";
    public static final String DEAL_VIEW_ALL = "DEAL_VIEW_ALL";
    public static final String DEAL_ASSIGN = "DEAL_ASSIGN";
    public static final String DEAL_STAGE_UPDATE = "DEAL_STAGE_UPDATE";


    // ==============================
    // SALES MANAGEMENT
    // ==============================

    public static final String SALE_CREATE = "SALE_CREATE";
    public static final String SALE_VIEW = "SALE_VIEW";
    public static final String SALE_VIEW_ALL = "SALE_VIEW_ALL";
    public static final String SALE_PAYMENT_UPDATE = "SALE_PAYMENT_UPDATE";
    public static final String SALE_SUMMARY_VIEW = "SALE_SUMMARY_VIEW";


    // ==============================
    // TARGET MANAGEMENT
    // ==============================

    public static final String TARGET_CREATE = "TARGET_CREATE";
    public static final String TARGET_UPDATE = "TARGET_UPDATE";
    public static final String TARGET_DELETE = "TARGET_DELETE";
    public static final String TARGET_VIEW = "TARGET_VIEW";
    public static final String TARGET_VIEW_ALL = "TARGET_VIEW_ALL";
    public static final String TARGET_TEAM_PERFORMANCE = "TARGET_TEAM_PERFORMANCE";
    public static final String TARGET_USER_PERFORMANCE = "TARGET_USER_PERFORMANCE";


    // ==============================
    // REPORT MANAGEMENT
    // ==============================

    public static final String REPORT_VIEW = "REPORT_VIEW";
    public static final String REPORT_SALES = "REPORT_SALES";
    public static final String REPORT_CONVERSION = "REPORT_CONVERSION";
    public static final String REPORT_LOST_DEALS = "REPORT_LOST_DEALS";
    public static final String REPORT_DASHBOARD = "REPORT_DASHBOARD";
}
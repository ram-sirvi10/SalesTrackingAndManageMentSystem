// config/menuConfig.js

export const menu = [
  {
    name: "Dashboard",
    path: "/",
    permissions: "VIEW_DASHBOARD_REPORT",
  },

  {
    name: "Users",
    path: "/users",
    permissions: "VIEW_ALL_USERS",
  },

  {
    name: "Roles",
    path: "/roles",
    permissions: "VIEW_ROLES",
  },

  //  Restrict for Super Admin
  {
    name: "Leads",
    path: "/leads",
    permissions: "VIEW_ALL_LEADS",
    hideForSuperAdmin: true,
  },
  {
    name: "Deals",
    path: "/deals",
    permissions: "VIEW_ALL_DEALS",
    hideForSuperAdmin: true,
  },
  {
    name: "Sales",
    path: "/sales",
    permissions: "VIEW_ALL_SALES",
    hideForSuperAdmin: true,
  },
  {
    name: "Reports",
    path: "/reports",
    permissions: "VIEW_SALES_REPORT",
    hideForSuperAdmin: true,
  },

  {
    name: "Targets",
    path: "/targets",
    permissions: "VIEW_ALL_TARGETS",
    hideForSuperAdmin: true,
  },
];

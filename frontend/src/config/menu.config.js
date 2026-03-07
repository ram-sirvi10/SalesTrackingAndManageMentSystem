import {
  LayoutDashboard,
  Users,
  Shield,
  UserPlus,
  TrendingUp,
  DollarSign,
  BarChart3,
  Target,
} from "lucide-react";

import { PERMISSIONS } from "@/config/permissions.config";

export const menu = [
  {
    name: "Dashboard",
    path: "/",
    permissions: [PERMISSIONS.REPORT_DASHBOARD],
    hideForSuperAdmin: true,
    icon: LayoutDashboard,
  },

  {
    name: "Users",
    path: "/users",
    permissions: [PERMISSIONS.USER_CREATE,
  PERMISSIONS.USER_UPDATE,
  PERMISSIONS.USER_DELETE,
  PERMISSIONS.USER_VIEW,
  PERMISSIONS.USER_APPROVE,
  PERMISSIONS.USER_STATUS_UPDATE,
],
    icon: Users,
  },

  {
    name: "Roles",
    path: "/roles",
    permissions: [PERMISSIONS. ROLE_CREATE,
  PERMISSIONS.ROLE_UPDATE,
  PERMISSIONS.ROLE_DELETE,
  PERMISSIONS.ROLE_VIEW],
    icon: Shield,
  },

  {
    name: "Leads",
    path: "/leads",
    permissions: [ PERMISSIONS.LEAD_CREATE,
   PERMISSIONS.LEAD_UPDATE,
   PERMISSIONS.LEAD_DELETE,
   PERMISSIONS.LEAD_VIEW,
   PERMISSIONS.LEAD_ASSIGN,
   PERMISSIONS.LEAD_STATUS_UPDATE],
    hideForSuperAdmin: true,
    icon: UserPlus,
  },

  {
    name: "Deals",
    path: "/deals",
    permissions: [ PERMISSIONS.DEAL_CREATE,
  PERMISSIONS.DEAL_UPDATE,
  PERMISSIONS.DEAL_DELETE,
  PERMISSIONS.DEAL_VIEW,
  PERMISSIONS.DEAL_ASSIGN,
  PERMISSIONS.DEAL_STAGE_UPDATE],
    hideForSuperAdmin: true,
    icon: TrendingUp,
  },

  {
    name: "Sales",
    path: "/sales",
    permissions: [ PERMISSIONS.SALE_CREATE,
  PERMISSIONS.SALE_VIEW,
  PERMISSIONS.SALE_PAYMENT_UPDATE,
  PERMISSIONS.SALE_SUMMARY_VIEW],
    hideForSuperAdmin: true,
    icon: DollarSign,
  },

  {
    name: "Targets",
    path: "/targets",
    permissions: [PERMISSIONS.TARGET_CREATE,
      PERMISSIONS.TARGET_DELETE,
      PERMISSIONS.TARGET_UPDATE,
      PERMISSIONS.TARGET_VIEW,
  PERMISSIONS.TARGET_TEAM_PERFORMANCE,
  PERMISSIONS.TARGET_USER_PERFORMANCE],
    hideForSuperAdmin: true,
    icon: Target,
  },

  {
    name: "Reports",
    path: "/reports",
    permissions: [ PERMISSIONS.REPORT_VIEW,
  PERMISSIONS.REPORT_SALES,
 PERMISSIONS. REPORT_CONVERSION,
 PERMISSIONS. REPORT_LOST_DEALS,
 PERMISSIONS. REPORT_DASHBOARD],
    hideForSuperAdmin: true,
    icon: BarChart3,
  },
];
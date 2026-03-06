// config/menuConfig.js
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

export const menu = [
  {
    name: "Dashboard",
    path: "/",
    permissions: "VIEW_DASHBOARD_REPORT",
    icon: LayoutDashboard,
  },

  {
    name: "Users",
    path: "/users",
    permissions: "VIEW_ALL_USERS",
    icon: Users,
  },

  {
    name: "Roles",
    path: "/roles",
    permissions: "VIEW_ROLES",
    icon: Shield,
  },

  //  Restrict for Super Admin
  {
    name: "Leads",
    path: "/leads",
    permissions: "VIEW_ALL_LEADS",
    hideForSuperAdmin: true,
    icon: UserPlus,
  },
  {
    name: "Deals",
    path: "/deals",
    permissions: "VIEW_ALL_DEALS",
    hideForSuperAdmin: true,
    icon: TrendingUp,
  },
  {
    name: "Sales",
    path: "/sales",
    permissions: "VIEW_ALL_SALES",
    hideForSuperAdmin: true,
    icon: DollarSign,
  },
  {
    name: "Reports",
    path: "/reports",
    permissions: "VIEW_ALL_SALES",
    hideForSuperAdmin: true,
    icon: BarChart3,
  },

  {
    name: "Targets",
    path: "/targets",
    permissions: "VIEW_ALL_TARGETS",
    hideForSuperAdmin: true,
    icon: Target,
  },
];

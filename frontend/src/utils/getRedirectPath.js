import { menu } from "@/config/menu.config";

export const getRedirectPath = (userPermissions, isSuperAdmin) => {
  for (const item of menu) {
    
    if (item.hideForSuperAdmin && isSuperAdmin) {
      continue;
    }

    const hasPermission = item.permissions?.some((p) =>
      userPermissions.includes(p)
    );

    if (hasPermission) {
      return item.path;
    }
  }

  return "/unauthorized";
};
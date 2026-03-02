import useAuth from "./useAuth";

const usePermission = () => {
  const { user } = useAuth();

  const userPermissions = user?.permissions || [];

  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions = []) => {
    return permissions.some((p) => userPermissions.includes(p));
  };

  const hasAllPermissions = (permissions = []) => {
    return permissions.every((p) => userPermissions.includes(p));
  };

  return { hasPermission, hasAnyPermission, hasAllPermissions };
};

export default usePermission;

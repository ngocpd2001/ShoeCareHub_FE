import { useLocation } from "react-router-dom";

function getRoleFromPath(pathname) {
  const parts = pathname.split("/");
  return parts[1];
}

function useRolePermission(requiredRoles) {
  const location = useLocation();
  const role = getRoleFromPath(location.pathname);
  return requiredRoles.includes(role);
}

export default useRolePermission;

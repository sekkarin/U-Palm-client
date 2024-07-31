// hooks/useRole.ts
import { useAppSelector } from "@/libs/hook";
import { Role } from "@/constants/enums/Role";

const useRole = (requiredRole: Role | Role[]) => {
  const roles = useAppSelector((state) => state.auth.roles);

  if (!roles) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.some((role) => roles.includes(role));
  }

  return roles.includes(requiredRole);
};

export default useRole;

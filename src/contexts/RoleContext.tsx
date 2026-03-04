import React, { createContext, useContext, useState } from "react";

export type UserRole = "admin" | "program_manager" | "mentor";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  canAccess: (requiredRoles: UserRole[]) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("admin");

  const canAccess = (requiredRoles: UserRole[]) => requiredRoles.includes(role);

  return (
    <RoleContext.Provider value={{ role, setRole, canAccess }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};

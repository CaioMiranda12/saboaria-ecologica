"use client";

import { createContext, useContext, type ReactNode } from "react";
const RoleContext = createContext<"ADMIN" | "EDITOR">("EDITOR");
export function AdminPermissions({ role, children }: { role: "ADMIN" | "EDITOR"; children: ReactNode }) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}
export function useCanDeleteRecords() { return useContext(RoleContext) === "ADMIN"; }

import React from "react";
import {
  usePlatformRoles,
  usePlatformRolesSummary,
} from "@/hooks/usePlatformData";
import { RolesHeader } from "./roles-components/RolesHeader";
import { RoleStats } from "./roles-components/RoleStats";
import { RoleTable } from "./roles-components/RoleTable";

export function PlatformRoles() {
  const { data: roles, isLoading: rolesLoading } = usePlatformRoles();
  const { data: summary, isLoading: summaryLoading } =
    usePlatformRolesSummary();

  const loading = rolesLoading || summaryLoading;

  return (
    <div className='space-y-6'>
      <RolesHeader />
      <RoleStats summary={summary} loading={loading} />
      <RoleTable roles={roles ?? []} />
    </div>
  );
}

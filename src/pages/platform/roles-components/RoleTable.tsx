import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleRow } from "./RoleRow";

interface RoleTableProps {
  roles: any[];
}

export function RoleTable({ roles }: RoleTableProps) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardHeader>
        <CardTitle className='font-serif text-xl'>
          Platform Administrative Roles
        </CardTitle>
        <CardDescription>
          Managed access levels for internal team members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead className='hidden sm:table-cell'>Users</TableHead>
              <TableHead className='hidden md:table-cell'>
                Permissions
              </TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.map((role) => (
              <RoleRow key={role.id} role={role} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

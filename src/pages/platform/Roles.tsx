import React from "react";
import {
  usePlatformRoles,
  usePlatformRolesSummary,
} from "@/hooks/usePlatformData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ShieldAlert,
  Users,
  MoreVertical,
  ShieldCheck,
  Lock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

function StatCardSkeleton() {
  return (
    <Card className='shadow-sm border-none bg-white p-6'>
      <div className='flex justify-between items-start'>
        <div className='space-y-2'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-7 w-12' />
        </div>
        <Skeleton className='h-10 w-10 rounded-lg' />
      </div>
    </Card>
  );
}

export function PlatformRoles() {
  const { data: roles, isLoading: rolesLoading } = usePlatformRoles();
  const { data: summary, isLoading: summaryLoading } =
    usePlatformRolesSummary();

  const totalAdmins = summary?.totalAdmins ?? 0;
  const activeRoles = summary?.activeRoles ?? 0;
  const permissionSets = summary?.permissionSets ?? 0;
  const lastAudit = summary?.lastAuditTimestamp
    ? formatDistanceToNow(new Date(summary.lastAuditTimestamp), {
        addSuffix: true,
      })
    : "N/A";

  const loading = rolesLoading || summaryLoading;

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
            Security
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage administrative access control.
          </p>
        </div>
        <Button className='w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]'>
          <Plus className='w-4 h-4 mr-2' /> Add Role
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card className='shadow-sm border-none bg-white p-6'>
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
                    Total Admins
                  </p>
                  <p className='text-2xl font-serif text-[#0F1B2D]'>
                    {totalAdmins}
                  </p>
                </div>
                <div className='p-2 bg-blue-50 rounded-lg text-blue-600'>
                  <Users className='w-5 h-5' />
                </div>
              </div>
            </Card>
            <Card className='shadow-sm border-none bg-white p-6'>
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
                    Active Roles
                  </p>
                  <p className='text-2xl font-serif text-[#0F1B2D]'>
                    {activeRoles}
                  </p>
                </div>
                <div className='p-2 bg-[#C9973A]/10 rounded-lg text-[#C9973A]'>
                  <ShieldAlert className='w-5 h-5' />
                </div>
              </div>
            </Card>
            <Card className='shadow-sm border-none bg-white p-6'>
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
                    Permission Sets
                  </p>
                  <p className='text-2xl font-serif text-[#0F1B2D]'>
                    {permissionSets}
                  </p>
                </div>
                <div className='p-2 bg-green-50 rounded-lg text-green-600'>
                  <Lock className='w-5 h-5' />
                </div>
              </div>
            </Card>
            <Card className='shadow-sm border-none bg-white p-6'>
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
                    Last Audit
                  </p>
                  <p className='text-lg font-bold text-[#0F1B2D]'>
                    {lastAudit}
                  </p>
                </div>
                <div className='p-2 bg-slate-100 rounded-lg text-slate-600'>
                  <ShieldCheck className='w-5 h-5' />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

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
              {roles?.map((role: any) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='hidden xs:flex w-8 h-8 rounded-full bg-[#0F1B2D] flex items-center justify-center text-white text-[10px] font-bold'>
                        {role.name.charAt(0)}
                      </div>
                      <span className='font-bold text-xs sm:text-sm text-[#0F1B2D] text-nowrap'>
                        {role.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <div className='flex items-center gap-2'>
                      <Users className='w-3.5 h-3.5 text-muted-foreground' />
                      <span className='text-sm font-medium'>{role.users}</span>
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex flex-wrap gap-1.5'>
                      {role.permissions
                        .slice(0, 2)
                        .map((perm: string, i: number) => (
                          <Badge
                            key={i}
                            variant='outline'
                            className='text-[9px] uppercase border-[#C9973A]/30 text-[#C9973A] bg-[#C9973A]/5'
                          >
                            {perm}
                          </Badge>
                        ))}
                      {role.permissions.length > 2 && (
                        <span className='text-[10px] text-muted-foreground ml-1'>
                          +{role.permissions.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

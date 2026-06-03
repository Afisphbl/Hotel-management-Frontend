import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ShieldAlert, Lock, ShieldCheck } from "lucide-react";
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

interface RoleStatsProps {
  summary: any;
  loading: boolean;
}

export function RoleStats({ summary, loading }: RoleStatsProps) {
  const totalAdmins = summary?.totalAdmins ?? 0;
  const activeRoles = summary?.activeRoles ?? 0;
  const permissionSets = summary?.permissionSets ?? 0;
  const lastAudit = summary?.lastAuditTimestamp
    ? formatDistanceToNow(new Date(summary.lastAuditTimestamp), {
        addSuffix: true,
      })
    : "N/A";

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <Card className='shadow-sm border-none bg-white p-6'>
        <div className='flex justify-between items-start'>
          <div className='space-y-1'>
            <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
              Total Admins
            </p>
            <p className='text-2xl font-serif text-[#0F1B2D]'>{totalAdmins}</p>
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
            <p className='text-2xl font-serif text-[#0F1B2D]'>{activeRoles}</p>
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
            <p className='text-2xl font-serif text-[#0F1B2D]'>{permissionSets}</p>
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
            <p className='text-lg font-bold text-[#0F1B2D]'>{lastAudit}</p>
          </div>
          <div className='p-2 bg-slate-100 rounded-lg text-slate-600'>
            <ShieldCheck className='w-5 h-5' />
          </div>
        </div>
      </Card>
    </div>
  );
}

import React from "react";
import { usePlatformGlobalFeatureFlags } from "@/hooks/usePlatformData";
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
  Flag,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PlatformFeatureFlags() {
  const { data: flags, isLoading, isError, error, refetch } = usePlatformGlobalFeatureFlags();

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "enabled":
      case "active":
        return <CheckCircle2 className='w-4 h-4 text-green-600' />;
      case "disabled":
      case "inactive":
        return <XCircle className='w-4 h-4 text-slate-400' />;
      case "beta":
      case "preview":
        return <AlertCircle className='w-4 h-4 text-amber-500' />;
      default:
        return <AlertCircle className='w-4 h-4 text-slate-400' />;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
            Flags
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Global rollouts & canaries.
          </p>
        </div>
        <Button className='w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]'>
          <Plus className='w-4 h-4 mr-2' /> Create Flag
        </Button>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative flex-1'>
          <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search global flags...'
            className='pl-9 bg-white border-none shadow-sm'
          />
        </div>
        <Button
          variant='outline'
          className='bg-white border-none shadow-sm gap-2'
        >
          <Filter className='w-4 h-4' /> Filters
        </Button>
      </div>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow className='bg-slate-50/50'>
                <TableHead className='pl-6'>Flag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='hidden sm:table-cell'>Scope</TableHead>
                <TableHead className='hidden md:table-cell w-[400px]'>
                  Description
                </TableHead>
                <TableHead className='text-right pr-6'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-12 text-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <AlertCircle className='w-6 h-6 text-red-400' />
                      <p className='text-sm text-red-500'>{error?.message || 'Failed to load feature flags'}</p>
                      <Button variant='outline' size='sm' onClick={() => refetch()}>Retry</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className='animate-pulse'>
                    <TableCell className='pl-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded bg-slate-200' />
                        <div className='h-4 bg-slate-200 rounded w-28' />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='h-4 bg-slate-200 rounded w-16' />
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <div className='h-5 bg-slate-200 rounded w-14' />
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <div className='h-4 bg-slate-200 rounded w-48' />
                    </TableCell>
                    <TableCell className='text-right pr-6'>
                      <div className='h-8 bg-slate-200 w-8 rounded ml-auto' />
                    </TableCell>
                  </TableRow>
                ))
              ) : !flags || flags.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='py-12 text-center animate-fade-in'
                  >
                    <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <Flag className='w-5 h-5 text-slate-300' />
                    </div>
                    <p className='font-serif text-base text-slate-500'>
                      No feature flags registered
                    </p>
                    <p className='text-xs text-slate-400'>
                      Add global flags to control tenant rolling options.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                flags.map((flag: any) => (
                  <TableRow
                    key={flag.id || flag.key}
                    className='group hover:bg-slate-50/50 transition-colors'
                  >
                    <TableCell className='pl-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='hidden sm:flex p-2 bg-slate-100 rounded group-hover:bg-[#C9973A]/10 transition-colors'>
                          <Flag className='w-4 h-4 text-slate-500 group-hover:text-[#C9973A]' />
                        </div>
                        <span className='font-bold text-xs sm:text-sm text-[#0F1B2D]'>
                          {flag.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {getStatusIcon(flag.status)}
                        <span className='capitalize text-[10px] sm:text-sm font-medium'>
                          {flag.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <Badge
                        variant='outline'
                        className='bg-white border-slate-200 text-slate-600 font-bold text-[10px] uppercase'
                      >
                        {flag.scope || flag.audience || 'All'}
                      </Badge>
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <p className='text-xs text-muted-foreground leading-relaxed'>
                        {flag.description}
                      </p>
                    </TableCell>
                    <TableCell className='text-right pr-6'>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreVertical className='w-4 h-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='shadow-sm border-none bg-white'>
          <CardHeader>
            <CardTitle className='font-serif text-lg'>
              Active Experiments
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
                    <AlertCircle className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-sm font-bold'>
                      New Booking Flow Experiment
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Running for 14 days • 12.4k users affected
                    </p>
                  </div>
                </div>
                <Badge className='bg-blue-600'>A/B Test</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className='shadow-sm border-none bg-white'>
          <CardHeader>
            <CardTitle className='font-serif text-lg'>
              Global Rollout Status
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                <span className='font-bold uppercase tracking-widest'>
                  v2 Platform Core
                </span>
                <span className='font-bold text-[#0F1B2D]'>84.2%</span>
              </div>
              <div className='h-2 w-full bg-slate-100 rounded-full overflow-hidden'>
                <div className='h-full bg-[#C9973A] w-[84%]' />
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                <span className='font-bold uppercase tracking-widest'>
                  Enhanced Security Protocol
                </span>
                <span className='font-bold text-[#0F1B2D]'>100%</span>
              </div>
              <div className='h-2 w-full bg-slate-100 rounded-full overflow-hidden'>
                <div className='h-full bg-green-500 w-full' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

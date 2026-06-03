import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

export function FlagTableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell className="pl-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-200" />
              <div className="h-4 bg-slate-200 rounded w-28" />
            </div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-slate-200 rounded w-16" />
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <div className="h-5 bg-slate-200 rounded w-14" />
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            <div className="h-4 bg-slate-200 rounded w-20" />
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            <div className="h-5 bg-slate-200 rounded w-20" />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <div className="h-4 bg-slate-200 rounded w-32" />
          </TableCell>
          <TableCell className="text-right pr-6">
            <div className="h-8 bg-slate-200 w-20 rounded ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

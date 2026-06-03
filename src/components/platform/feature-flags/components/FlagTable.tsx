import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FlagTableRow } from "./FlagTableRow";
import { FlagTableSkeleton } from "./FlagTableSkeleton";
import { FlagTableEmpty } from "./FlagTableEmpty";
import type { FeatureFlag } from "../utils/flagTypes";

interface FlagTableProps {
  flags: FeatureFlag[];
  isLoading: boolean;
  isError: boolean;
  error?: { message?: string } | null;
  onRetry: () => void;
  isToggling: boolean;
  hasActiveFilters: boolean;
  onEdit: (flag: FeatureFlag) => void;
  onDelete: (flag: FeatureFlag) => void;
  onToggle: (flag: FeatureFlag) => void;
}

export function FlagTable({
  flags,
  isLoading,
  isError,
  error,
  onRetry,
  isToggling,
  hasActiveFilters,
  onEdit,
  onDelete,
  onToggle,
}: FlagTableProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="pl-6">Flag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Scope</TableHead>
              <TableHead className="hidden lg:table-cell">Hotel</TableHead>
              <TableHead className="hidden lg:table-cell">Strategy</TableHead>
              <TableHead className="hidden md:table-cell w-[250px]">
                Description
              </TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <FlagTableEmpty
                isError
                error={error}
                onRetry={onRetry}
                hasActiveFilters={hasActiveFilters}
              />
            ) : isLoading ? (
              <FlagTableSkeleton />
            ) : flags.length === 0 ? (
              <FlagTableEmpty
                isError={false}
                onRetry={onRetry}
                hasActiveFilters={hasActiveFilters}
              />
            ) : (
              flags.map((flag) => (
                <FlagTableRow
                  key={flag.id}
                  flag={flag}
                  isToggling={isToggling}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggle={onToggle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

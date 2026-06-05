import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, ShieldAlert } from "lucide-react";
import { HotelsFilters } from "./HotelsFilters";
import { HotelTableRow } from "./HotelTableRow";
import type { Hotel, PlanFilterValue, SortValue } from "./utils";

interface HotelTableProps {
  hotels: Hotel[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRefetch: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortBy: SortValue;
  onSortChange: (v: SortValue) => void;
  planFilter: PlanFilterValue;
  onPlanFilterChange: (v: PlanFilterValue) => void;
  onView: (hotel: Hotel) => void;
  onEdit: (hotel: Hotel) => void;
  onDuplicate: (hotel: Hotel) => void;
  onImpersonate: (hotel: Hotel) => void;
  onStatusChange: (hotel: Hotel, status: string) => void;
  onDelete: (hotel: Hotel) => void;
}

export function HotelTable({
  hotels, isLoading, isError, error, onRefetch,
  searchQuery, onSearchChange, sortBy, onSortChange,
  planFilter, onPlanFilterChange,
  onView, onEdit, onDuplicate, onImpersonate, onStatusChange, onDelete,
}: HotelTableProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader className="border-b border-muted pb-4">
        <HotelsFilters
          searchQuery={searchQuery} onSearchChange={onSearchChange}
          sortBy={sortBy} onSortChange={onSortChange}
          planFilter={planFilter} onPlanFilterChange={onPlanFilterChange}
        />
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F8F7F4]">
            <TableRow>
              <TableHead className="w-75">Property</TableHead>
              <TableHead className="hidden lg:table-cell">Owner</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="hidden sm:table-cell">Rooms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Billing</TableHead>
              <TableHead className="hidden xl:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 animate-bounce">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="font-serif text-lg text-slate-800 font-bold">Unauthorized Connection or Session Expired</p>
                  <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                    {error?.message ?? "Verify you are properly signed in as Platform Super Admin to initialize tenant lookups."}
                  </p>
                  <div className="flex justify-center gap-3 mt-6">
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-slate-200">
                      Refresh Page
                    </Button>
                    <Button size="sm" onClick={onRefetch} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                      Retry Connection
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-24" />
                        <div className="h-3 bg-slate-200 rounded w-28" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-20" />
                      <div className="h-3 bg-slate-200 rounded w-24" />
                    </div>
                  </TableCell>
                  <TableCell><div className="h-5 bg-slate-200 rounded w-14" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><div className="h-4 bg-slate-200 rounded w-8" /></TableCell>
                  <TableCell><div className="h-6 bg-slate-200 rounded-full w-16" /></TableCell>
                  <TableCell className="hidden xl:table-cell"><div className="h-4 bg-slate-200 rounded w-16" /></TableCell>
                  <TableCell className="text-right"><div className="h-8 bg-slate-200 rounded w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : hotels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-20 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="font-serif text-lg text-slate-500">No properties found</p>
                  <p className="text-sm text-slate-400">There are no operational hotel tenants seeded in system.</p>
                </TableCell>
              </TableRow>
            ) : (
              hotels.map((hotel) => (
                <HotelTableRow
                  key={hotel.id}
                  hotel={hotel}
                  onView={onView}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                  onImpersonate={onImpersonate}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

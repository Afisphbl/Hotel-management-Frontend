import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

interface UserFiltersProps {
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAddUser: () => void;
}

export function UserFilters({
  searchQuery,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onAddUser,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Search on the left */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search users..."
          className="pl-9 bg-white border-slate-200 shadow-sm h-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters and Action on the right */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[140px] bg-white border-slate-200 shadow-sm text-xs font-medium h-9">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-roles">All Roles</SelectItem>
            <SelectItem value="OWNER">Owner</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
            <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
            <SelectItem value="HOUSEKEEPING">Housekeeping</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px] bg-white border-slate-200 shadow-sm text-xs font-medium h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending Invite</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2 shadow-sm h-9"
          onClick={onAddUser}
        >
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>
    </div>
  );
}
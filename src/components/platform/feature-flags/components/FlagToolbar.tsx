import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, X } from "lucide-react";

const STATUS_OPTIONS = ["all", "enabled", "disabled", "scheduled"] as const;
const STRATEGY_OPTIONS = [
  { value: "all", label: "All Strategies" },
  { value: "full_rollout", label: "Full Rollout" },
  { value: "percentage", label: "Percentage" },
  { value: "user_based", label: "User Based" },
  { value: "role_based", label: "Role Based" },
  { value: "conditional", label: "Conditional" },
  { value: "a_b_test", label: "A/B Test" },
] as const;

interface FlagToolbarProps {
  searchQuery: string;
  statusFilter: string;
  strategyFilter: string;
  scopeFilter: string;
  onSearch: (value: string) => void;
  onStatusFilter: (value: string) => void;
  onStrategyFilter: (value: string) => void;
  onScopeFilter: (value: string) => void;
  onCreateClick: () => void;
}

export function FlagToolbar({
  searchQuery,
  statusFilter,
  strategyFilter,
  scopeFilter,
  onSearch,
  onStatusFilter,
  onStrategyFilter,
  onScopeFilter,
  onCreateClick,
}: FlagToolbarProps) {
  return (
    <>
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">
            Flags
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Global rollouts &amp; canaries.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]"
          onClick={onCreateClick}
        >
          <Plus className="w-4 h-4 mr-2" /> Create Flag
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search flags..."
            className="pl-9 bg-white border-none shadow-sm"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scope */}
        <Select value={scopeFilter} onValueChange={(v) => v && onScopeFilter(v)}>
          <SelectTrigger className="w-28 bg-white border-none shadow-sm">
            <SelectValue placeholder="Scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scopes</SelectItem>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="hotel">Per Hotel</SelectItem>
          </SelectContent>
        </Select>

        {/* Status pills */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg self-start">
          {STATUS_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => onStatusFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                statusFilter === type
                  ? "bg-white text-[#0F1B2D] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {type === "all" ? "All" : type}
            </button>
          ))}
        </div>

        {/* Strategy */}
        <Select
          value={strategyFilter}
          onValueChange={(v) => v && onStrategyFilter(v)}
        >
          <SelectTrigger className="w-40 bg-white border-none shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STRATEGY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Flag,
  MoreVertical,
  Edit,
  Trash2,
  ToggleLeft,
} from "lucide-react";
import {
  getStatusIcon,
  getScopeBadge,
  getStatusBadgeColor,
  formatStrategy,
  formatStatus,
} from "../utils/flagFormatters";
import type { FeatureFlag } from "../utils/flagTypes";

interface FlagTableRowProps {
  flag: FeatureFlag;
  isToggling: boolean;
  onEdit: (flag: FeatureFlag) => void;
  onDelete: (flag: FeatureFlag) => void;
  onToggle: (flag: FeatureFlag) => void;
}

export function FlagTableRow({
  flag,
  isToggling,
  onEdit,
  onDelete,
  onToggle,
}: FlagTableRowProps) {
  return (
    <TableRow className="group hover:bg-slate-50/50 transition-colors">
      {/* Name */}
      <TableCell className="pl-6 py-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex p-2 bg-slate-100 rounded group-hover:bg-[#C9973A]/10 transition-colors">
            <Flag className="w-4 h-4 text-slate-500 group-hover:text-[#C9973A]" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-[#0F1B2D]">
            {flag.name}
          </span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <div className="flex items-center gap-2">
          {getStatusIcon(flag.status)}
          <span
            className={`capitalize text-[10px] sm:text-sm font-medium ${getStatusBadgeColor(flag.status)}`}
          >
            {formatStatus(flag.status)}
          </span>
        </div>
      </TableCell>

      {/* Scope */}
      <TableCell className="hidden sm:table-cell">
        {getScopeBadge(flag)}
      </TableCell>

      {/* Hotel */}
      <TableCell className="hidden lg:table-cell">
        {flag.hotel ? (
          <span className="text-xs text-muted-foreground font-medium">
            {flag.hotel.name}
          </span>
        ) : (
          <span className="text-xs text-slate-300 italic">—</span>
        )}
      </TableCell>

      {/* Strategy */}
      <TableCell className="hidden lg:table-cell">
        <span className="text-xs text-muted-foreground">
          {formatStrategy(flag.rolloutStrategy)}
        </span>
      </TableCell>

      {/* Description */}
      <TableCell className="hidden md:table-cell">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {flag.description || "—"}
        </p>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right pr-6">
        <div className="flex items-center justify-end gap-2">
          <Switch
            size="sm"
            checked={flag.status === "ENABLED"}
            onCheckedChange={() => onToggle(flag)}
            disabled={isToggling}
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
            >
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="gap-2" onClick={() => onEdit(flag)}>
                <Edit className="w-4 h-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2"
                onClick={() => onToggle(flag)}
              >
                <ToggleLeft className="w-4 h-4" /> Toggle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-red-600"
                onClick={() => onDelete(flag)}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

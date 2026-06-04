import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
  MoreHorizontal, Eye, Edit, Copy, ShieldAlert, Key,
  Ban, CheckCircle2, Trash2, Globe,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { type Hotel, getTextValue, getNumericValue, STATUS_LABELS } from "./utils";

interface HotelTableRowProps {
  hotel: Hotel;
  onView: (hotel: Hotel) => void;
  onEdit: (hotel: Hotel) => void;
  onDuplicate: (hotel: Hotel) => void;
  onImpersonate: (hotel: Hotel) => void;
  onStatusChange: (hotel: Hotel, status: string) => void;
  onDelete: (hotel: Hotel) => void;
}

export function HotelTableRow({
  hotel, onView, onEdit, onDuplicate, onImpersonate, onStatusChange, onDelete,
}: HotelTableRowProps) {
  const rooms = getNumericValue(hotel.totalRooms, hotel.rooms);

  return (
    <TableRow
      className="hover:bg-[#F8F7F4]/50 transition-colors cursor-pointer group border-b border-slate-50"
      onClick={() => onView(hotel)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F1B2D]/5 flex items-center justify-center font-serif text-[#0F1B2D] font-bold">
            {hotel.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-[#0F1B2D] group-hover:text-[#C9973A] transition-colors">{hotel.name}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1">
              <Globe className="w-2 h-2" /> {hotel.name.toLowerCase().replace(/ /g, "-")}.pms.cloud
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <div className="text-sm">
          <p className="font-medium text-[#0F1B2D]">{getTextValue(hotel.ownerName, hotel.owner)}</p>
          <p className="text-[10px] text-muted-foreground">{getTextValue(hotel.ownerEmail, hotel.email)}</p>
        </div>
      </TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "font-bold uppercase text-[9px] border-none px-2 py-0.5",
            hotel.plan === "Enterprise" ? "bg-[#0F1B2D] text-white"
              : hotel.plan === "Pro" ? "bg-[#C9973A] text-white"
              : "bg-slate-200 text-slate-700",
          )}
        >
          {hotel.plan}
        </Badge>
      </TableCell>

      <TableCell className="hidden sm:table-cell text-sm font-serif">
        {typeof rooms === "number" ? rooms : 0}
      </TableCell>

      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-start">
          <Select value={hotel.status ?? ""} onValueChange={(v) => onStatusChange(hotel, v ?? "")}>
            <SelectTrigger className="h-8 w-32 bg-[#F8F7F4] border-slate-200 text-xs font-medium">
              <span>{STATUS_LABELS[hotel.status ?? ""] ?? hotel.status}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TableCell>

      <TableCell className="hidden xl:table-cell text-[11px] text-muted-foreground font-medium">
        {hotel.created ? format(new Date(hotel.created), "MMM d, yyyy") : "—"}
      </TableCell>

      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn("h-8 w-8", buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="gap-2" onClick={() => onView(hotel)}>
              <Eye className="w-4 h-4" /> View Full Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(hotel)}>
              <Edit className="w-4 h-4" /> Quick Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => onDuplicate(hotel)}>
              <Copy className="w-4 h-4" /> Duplicate Property
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => onImpersonate(hotel)}>
              <ShieldAlert className="w-4 h-4" /> Impersonate Owner
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" onClick={() => toast.info("Master password reset email sent")}>
              <Key className="w-4 h-4" /> Reset Master Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {hotel.status === "active" ? (
              <DropdownMenuItem className="gap-2 text-amber-600" onClick={() => onStatusChange(hotel, "suspended")}>
                <Ban className="w-4 h-4" /> Suspend Tenant
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="gap-2 text-green-600" onClick={() => onStatusChange(hotel, "active")}>
                <CheckCircle2 className="w-4 h-4" /> Reactivate Tenant
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="gap-2 text-red-600" onClick={() => onDelete(hotel)}>
              <Trash2 className="w-4 h-4" /> Delete Tenant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

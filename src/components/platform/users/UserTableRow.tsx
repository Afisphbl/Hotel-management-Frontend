import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  ExternalLink,
  User,
  Mail,
  UserCheck,
  ShieldAlert,
  RefreshCw,
  UserMinus,
  ShieldQuestion,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
  invitedBy?: string;
  mfaEnabled: boolean;
}

interface UserTableRowProps {
  user: User;
  onImpersonate: (user: User) => void;
  onResetPassword: (user: User) => void;
  onActivate: (user: User) => void;
  onSuspend: (user: User) => void;
  onTransferOwnership: (user: User) => void;
  onRemove: (user: User) => void;
}

const ROLE_COLORS: Record<string, string> = {
  OWNER: "bg-[#C9973A] text-white border-none",
  MANAGER: "bg-[#0F1B2D] text-white border-none",
  HOTEL_OWNER: "bg-[#C9973A] text-white border-none",
  HOTEL_MANAGER: "bg-[#0F1B2D] text-white border-none",
  RECEPTIONIST: "bg-blue-100 text-blue-700 border-none",
  ACCOUNTANT: "bg-slate-100 text-slate-700 border-none",
  HOUSEKEEPING: "bg-green-100 text-green-700 border-none",
};

export function UserTableRow({
  user,
  onImpersonate,
  onResetPassword,
  onActivate,
  onSuspend,
  onTransferOwnership,
  onRemove,
}: UserTableRowProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <tr className="group transition-colors">
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 rounded-xl border bg-slate-50">
              <AvatarFallback className="text-[10px] font-bold text-slate-400">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#0F1B2D]">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              "font-bold text-[9px] uppercase tracking-wider px-2 py-0.5",
              ROLE_COLORS[user.role.toUpperCase()] ||
                "bg-slate-100 text-slate-600 border-none",
            )}
          >
            {user.role}
          </Badge>
        </TableCell>
        <TableCell>
          <StatusBadge status={user.status} />
        </TableCell>
        <TableCell>
          {user.lastLogin ? (
            <Tooltip>
              <TooltipTrigger render={<span className="text-xs text-slate-500 cursor-help border-b border-dotted border-slate-300" />}>
                {formatDistanceToNow(new Date(user.lastLogin), {
                  addSuffix: true,
                })}
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">
                {format(new Date(user.lastLogin), "MMMM d, yyyy HH:mm:ss")}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-xs text-slate-300 italic">Never</span>
          )}
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <span className="text-xs text-slate-500">
            {user.invitedBy || "System"}
          </span>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          {user.mfaEnabled ? (
            <Badge className="bg-green-50 text-green-700 border-none flex items-center gap-1 w-fit text-[9px]">
              <ShieldCheck className="w-3 h-3" /> Enabled
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-slate-400 border-slate-200 flex items-center gap-1 w-fit text-[9px]"
            >
              <ShieldQuestion className="w-3 h-3" /> Disabled
            </Badge>
          )}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" />}>
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Admin Controls
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="gap-2 text-xs"
                  onClick={() =>
                    window.open(`/platform/users/${user.id}`, "_blank")
                  }
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Full Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-xs"
                  onClick={() => onImpersonate(user)}
                >
                  <User className="w-3.5 h-3.5" /> Impersonate User
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-xs"
                  onClick={() => onResetPassword(user)}
                >
                  <Mail className="w-3.5 h-3.5" /> Send Reset Link
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Lifecycle
                </DropdownMenuLabel>

                {user.status === "suspended" ? (
                  <DropdownMenuItem
                    className="gap-2 text-xs text-green-600"
                    onClick={() => onActivate(user)}
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Reactivate User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="gap-2 text-xs text-amber-600"
                    onClick={() => onSuspend(user)}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Suspend User
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  className="gap-2 text-xs"
                  onClick={() => onTransferOwnership(user)}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Transfer Ownership
                </DropdownMenuItem>

                {user.role.toUpperCase() !== "OWNER" && (
                  <DropdownMenuItem
                    className="gap-2 text-xs text-red-600"
                    onClick={() => onRemove(user)}
                  >
                    <UserMinus className="w-3.5 h-3.5" /> Remove User
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </tr>
    </TooltipProvider>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
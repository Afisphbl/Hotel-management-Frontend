import { useParams } from "@tanstack/react-router";
import {
  useHotelUsers,
  useSuspendPlatformUser,
  useActivatePlatformUser,
  useSendPasswordResetLink,
  useTransferOwnership,
  useCreateTenantUser,
  useRemoveTenantUser,
} from "@/hooks/usePlatformData";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MoreVertical,
  Database,
  Search,
  UserPlus,
  ShieldAlert,
  UserCheck,
  Key,
  UserMinus,
  RefreshCw,
  Mail,
  User,
  ExternalLink,
  ShieldQuestion,
  Info,
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
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format, formatDistanceToNow } from "date-fns";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ROLE_COLORS: Record<string, string> = {
  OWNER: "bg-[#C9973A] text-white border-none",
  MANAGER: "bg-[#0F1B2D] text-white border-none",
  HOTEL_OWNER: "bg-[#C9973A] text-white border-none",
  HOTEL_MANAGER: "bg-[#0F1B2D] text-white border-none",
  RECEPTIONIST: "bg-blue-100 text-blue-700 border-none",
  ACCOUNTANT: "bg-slate-100 text-slate-700 border-none",
  HOUSEKEEPING: "bg-green-100 text-green-700 border-none",
};

export function HotelUsers() {
  const { id: hotelId } = useParams({ from: "/auth/platform/hotels/$id" });
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useHotelUsers(hotelId);
  const impersonate = useAuthStore((state) => state.impersonate);

  // Mutations
  const suspendMutation = useSuspendPlatformUser();
  const activateMutation = useActivatePlatformUser();
  const resetPasswordMutation = useSendPasswordResetLink();
  const transferOwnershipMutation = useTransferOwnership();
  const createUserMutation = useCreateTenantUser();
  const removeUserMutation = useRemoveTenantUser();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [statusFilter, setStatusFilter] = useState("all-status");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "HOTEL_MANAGER",
    phone: "",
  });
  const [transferTargetId, setTransferTargetId] = useState("");

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user: any) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "all-roles" ||
        user.role.toUpperCase() === roleFilter.toUpperCase();
      const matchesStatus =
        statusFilter === "all-status" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleImpersonate = async (user: any) => {
    try {
      toast.promise(impersonate(hotelId), {
        loading: "Starting impersonation session...",
        success: `Now impersonating ${user.name}`,
        error: "Failed to impersonate user",
      });
    } catch (err) {}
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    try {
      await suspendMutation.mutateAsync({
        id: selectedUser.id,
        reason: "Suspended by Super Admin",
      });
      toast.success(`${selectedUser.name} has been suspended.`);
      setIsSuspendModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to suspend user");
    }
  };

  const handleActivate = async (user: any) => {
    try {
      await activateMutation.mutateAsync(user.id);
      toast.success(`${user.name} has been reactivated.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to reactivate user");
    }
  };

  const handleResetPassword = async (user: any) => {
    try {
      await resetPasswordMutation.mutateAsync(user.id);
      toast.success(`Password reset link sent to ${user.email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    }
  };

  const handleTransferOwnership = async () => {
    if (!transferTargetId) {
      toast.error("Please select a new owner");
      return;
    }
    try {
      await transferOwnershipMutation.mutateAsync({
        hotelId,
        newOwnerId: transferTargetId,
      });
      toast.success("Ownership transferred successfully");
      setIsTransferModalOpen(false);
      setTransferTargetId("");
    } catch (err: any) {
      toast.error(err.message || "Failed to transfer ownership");
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Name and Email are required");
      return;
    }
    try {
      await createUserMutation.mutateAsync({ hotelId, data: newUser });
      toast.success(`Invitation sent to ${newUser.email}`);
      setIsAddModalOpen(false);
      setNewUser({ name: "", email: "", role: "HOTEL_MANAGER", phone: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) return;
    try {
      await removeUserMutation.mutateAsync({
        hotelId,
        userId: selectedUser.id,
      });
      toast.success(`${selectedUser.name} has been removed from the tenant.`);
      setIsRemoveModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove user");
    }
  };

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
      <div className='space-y-6'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          {/* Search on the left */}
          <div className='relative w-full max-w-sm'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <Input
              placeholder='Search users...'
              className='pl-9 bg-white border-slate-200 shadow-sm h-9'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters and Action on the right */}
          <div className='flex flex-wrap items-center gap-3'>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className='w-[140px] bg-white border-slate-200 shadow-sm text-xs font-medium h-9'>
                <SelectValue placeholder='Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all-roles'>All Roles</SelectItem>
                <SelectItem value='OWNER'>Owner</SelectItem>
                <SelectItem value='MANAGER'>Manager</SelectItem>
                <SelectItem value='RECEPTIONIST'>Receptionist</SelectItem>
                <SelectItem value='ACCOUNTANT'>Accountant</SelectItem>
                <SelectItem value='HOUSEKEEPING'>Housekeeping</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[140px] bg-white border-slate-200 shadow-sm text-xs font-medium h-9'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all-status'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='suspended'>Suspended</SelectItem>
                <SelectItem value='pending'>Pending Invite</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className='bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2 shadow-sm h-9'
              onClick={() => setIsAddModalOpen(true)}
            >
              <UserPlus className='w-4 h-4' /> Add User
            </Button>
          </div>
        </div>

        <Card className='shadow-sm border-none bg-white overflow-hidden'>
          <CardHeader className='bg-slate-50/50 border-b'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='font-serif text-xl'>
                  Tenant User Directory
                </CardTitle>
                <CardDescription>
                  Administrative oversight and emergency access controls.
                </CardDescription>
              </div>
              <Badge
                variant='outline'
                className='bg-blue-50 text-blue-700 border-blue-200'
              >
                {filteredUsers.length} total users
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='p-4 space-y-4'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='flex items-center gap-4'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <Skeleton className='h-4 flex-1' />
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className='flex flex-col items-center justify-center py-16 text-center'>
                <Database className='w-10 h-10 text-red-400 mb-3' />
                <h3 className='text-lg font-serif text-slate-500'>
                  Failed to load users
                </h3>
                <p className='text-xs text-slate-400 mt-1 mb-4'>
                  {error?.message}
                </p>
                <Button variant='outline' size='sm' onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-slate-50/30 hover:bg-slate-50/30'>
                      <TableHead className='font-bold uppercase tracking-widest text-[10px]'>
                        User
                      </TableHead>
                      <TableHead className='font-bold uppercase tracking-widest text-[10px]'>
                        Role
                      </TableHead>
                      <TableHead className='font-bold uppercase tracking-widest text-[10px]'>
                        Status
                      </TableHead>
                      <TableHead className='font-bold uppercase tracking-widest text-[10px]'>
                        Last Activity
                      </TableHead>
                      <TableHead className='font-bold uppercase tracking-widest text-[10px] hidden lg:table-cell'>
                        Invited By
                      </TableHead>
                      <TableHead className='font-bold uppercase tracking-widest text-[10px] hidden lg:table-cell'>
                        2FA
                      </TableHead>
                      <TableHead className='text-right font-bold uppercase tracking-widest text-[10px]'>
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: any) => (
                      <TableRow
                        key={user.id}
                        className='group transition-colors'
                      >
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-9 w-9 rounded-xl border bg-slate-50'>
                              <AvatarFallback className='text-[10px] font-bold text-slate-400'>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                              <span className='font-bold text-sm text-[#0F1B2D]'>
                                {user.name}
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
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
                              <TooltipTrigger render={<span className='text-xs text-slate-500 cursor-help border-b border-dotted border-slate-300' />}>
                                {formatDistanceToNow(
                                  new Date(user.lastLogin),
                                  { addSuffix: true },
                                )}
                              </TooltipTrigger>
                              <TooltipContent
                                side='top'
                                className='text-[10px] font-bold'
                              >
                                {format(
                                  new Date(user.lastLogin),
                                  "MMMM d, yyyy HH:mm:ss",
                                )}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className='text-xs text-slate-300 italic'>
                              Never
                            </span>
                          )}
                        </TableCell>
                        <TableCell className='hidden lg:table-cell'>
                          <span className='text-xs text-slate-500'>
                            {user.invitedBy || "System"}
                          </span>
                        </TableCell>
                        <TableCell className='hidden lg:table-cell'>
                          {user.mfaEnabled ? (
                            <Badge className='bg-green-50 text-green-700 border-none flex items-center gap-1 w-fit text-[9px]'>
                              <ShieldCheck className='w-3 h-3' /> Enabled
                            </Badge>
                          ) : (
                            <Badge
                              variant='outline'
                              className='text-slate-400 border-slate-200 flex items-center gap-1 w-fit text-[9px]'
                            >
                              <ShieldQuestion className='w-3 h-3' /> Disabled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant='ghost' size='icon' className='h-8 w-8 hover:bg-slate-100' />}>
                              <MoreVertical className='w-4 h-4' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-48'>
                              <DropdownMenuGroup>
                                <DropdownMenuLabel className='text-[10px] uppercase tracking-widest font-bold text-slate-400'>
                                  Admin Controls
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                  className='gap-2 text-xs'
                                  onClick={() =>
                                    window.open(
                                      `/platform/users/${user.id}`,
                                      "_blank",
                                    )
                                  }
                                >
                                  <ExternalLink className='w-3.5 h-3.5' /> View
                                  Full Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='gap-2 text-xs'
                                  onClick={() => handleImpersonate(user)}
                                >
                                  <User className='w-3.5 h-3.5' /> Impersonate
                                  User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='gap-2 text-xs'
                                  onClick={() => handleResetPassword(user)}
                                >
                                  <Mail className='w-3.5 h-3.5' /> Send Reset
                                  Link
                                </DropdownMenuItem>
                              </DropdownMenuGroup>

                              <DropdownMenuSeparator />

                              <DropdownMenuGroup>
                                <DropdownMenuLabel className='text-[10px] uppercase tracking-widest font-bold text-slate-400'>
                                  Lifecycle
                                </DropdownMenuLabel>

                                {user.status === "suspended" ? (
                                  <DropdownMenuItem
                                    className='gap-2 text-xs text-green-600'
                                    onClick={() => handleActivate(user)}
                                  >
                                    <UserCheck className='w-3.5 h-3.5' />{" "}
                                    Reactivate User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className='gap-2 text-xs text-amber-600'
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsSuspendModalOpen(true);
                                    }}
                                  >
                                    <ShieldAlert className='w-3.5 h-3.5' />{" "}
                                    Suspend User
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  className='gap-2 text-xs'
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsTransferModalOpen(true);
                                  }}
                                >
                                  <RefreshCw className='w-3.5 h-3.5' /> Transfer
                                  Ownership
                                </DropdownMenuItem>

                                {user.role.toUpperCase() !== "OWNER" && (
                                  <DropdownMenuItem
                                    className='gap-2 text-xs text-red-600'
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsRemoveModalOpen(true);
                                    }}
                                  >
                                    <UserMinus className='w-3.5 h-3.5' /> Remove
                                    User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-20 text-center'>
                <Database className='w-12 h-12 text-slate-200 mb-4' />
                <h3 className='text-lg font-serif text-slate-400'>
                  No users found matching your criteria
                </h3>
                <p className='text-sm text-slate-300 mt-1'>
                  Try adjusting your search or filters.
                </p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-6'
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("all-roles");
                    setStatusFilter("all-status");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <div className='flex items-start gap-3 p-4 bg-slate-100 rounded-xl border border-slate-200'>
          <Info className='w-5 h-5 text-slate-400 shrink-0 mt-0.5' />
          <div className='text-xs text-slate-500 space-y-1'>
            <p className='font-bold text-slate-700 uppercase tracking-widest text-[9px]'>
              Administrative Policy
            </p>
            <p>
              Super Admins provide high-level support and emergency oversight.
              Normal staff management (hiring, role assignments) should be
              performed by the Hotel Owner via the tenant dashboard.
            </p>
          </div>
        </div>

        {/* Add User Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='font-serif text-xl'>
                Administrative User Creation
              </DialogTitle>
              <DialogDescription>
                This tool is intended for emergency onboarding or administrative
                support. The user will receive an invitation email to set their
                password.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  placeholder='e.g. John Doe'
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com'
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label>Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(v) => setNewUser({ ...newUser, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='HOTEL_OWNER'>Owner</SelectItem>
                      <SelectItem value='HOTEL_MANAGER'>Manager</SelectItem>
                      <SelectItem value='RECEPTIONIST'>Receptionist</SelectItem>
                      <SelectItem value='ACCOUNTANT'>Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone (Optional)</Label>
                  <Input
                    id='phone'
                    placeholder='+1...'
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant='ghost' onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? (
                  <RefreshCw className='w-4 h-4 animate-spin mr-2' />
                ) : (
                  <Mail className='w-4 h-4 mr-2' />
                )}
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspend Modal */}
        <Dialog open={isSuspendModalOpen} onOpenChange={setIsSuspendModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <ShieldAlert className='w-5 h-5 text-amber-600' />
                Suspend User Access
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to suspend{" "}
                <strong>{selectedUser?.name}</strong>? The user will immediately
                lose access to all platform features and active sessions will be
                revoked.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='mt-6'>
              <Button
                variant='ghost'
                onClick={() => setIsSuspendModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleSuspend}
                disabled={suspendMutation.isPending}
              >
                {suspendMutation.isPending ? (
                  <RefreshCw className='w-4 h-4 animate-spin mr-2' />
                ) : null}
                Suspend Access
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Transfer Ownership Modal */}
        <Dialog
          open={isTransferModalOpen}
          onOpenChange={setIsTransferModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Property Ownership</DialogTitle>
              <DialogDescription>
                Transferring ownership is a critical action. Only one OWNER can
                exist per hotel. The current owner will be downgraded to
                MANAGER.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label>Select New Owner</Label>
                <Select
                  value={transferTargetId}
                  onValueChange={setTransferTargetId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select an active user...' />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      ?.filter(
                        (u: any) =>
                          u.id !== selectedUser?.id && u.status === "active",
                      )
                      .map((u: any) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='p-3 bg-amber-50 rounded-lg text-[11px] text-amber-800 border border-amber-100'>
                <strong>Warning:</strong> The selected user will become the new
                primary OWNER and legal representative for this property.
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='ghost'
                onClick={() => setIsTransferModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className='bg-[#C9973A] hover:bg-[#b88a35]'
                onClick={handleTransferOwnership}
                disabled={transferOwnershipMutation.isPending}
              >
                {transferOwnershipMutation.isPending ? (
                  <RefreshCw className='w-4 h-4 animate-spin mr-2' />
                ) : null}
                Confirm Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove User Modal */}
        <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove User from Tenant</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently remove{" "}
                <strong>{selectedUser?.name}</strong> from this hotel? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='mt-6'>
              <Button
                variant='ghost'
                onClick={() => setIsRemoveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleRemoveUser}
                disabled={removeUserMutation.isPending}
              >
                {removeUserMutation.isPending ? (
                  <RefreshCw className='w-4 h-4 animate-spin mr-2' />
                ) : null}
                Remove User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
      <path d='m9 12 2 2 4-4' />
    </svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

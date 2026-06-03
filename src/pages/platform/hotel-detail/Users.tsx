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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useMemo } from "react";

// Import extracted components
import {
  UserTableHeader,
  UserTableRow,
  UserFilters,
  AdminInfoCard,
  AddUserModal,
  SuspendUserModal,
  TransferOwnershipModal,
  RemoveUserModal,
  UserTableSkeleton,
  UserTableEmpty,
  UserTableError,
} from "@/components/platform/users";

// User interface for type safety
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
    <div className='space-y-6'>
      {/* Filters Section */}
      <UserFilters
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onRoleChange={setRoleFilter}
        onStatusChange={setStatusFilter}
        onAddUser={() => setIsAddModalOpen(true)}
      />

      {/* Users Card */}
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
            <UserTableSkeleton />
          ) : isError ? (
            <UserTableError
              message={error?.message}
              onRetry={() => refetch()}
            />
          ) : filteredUsers.length > 0 ? (
            <div className='overflow-x-auto'>
              <UserTableHeader>
                {filteredUsers.map((user: any) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onImpersonate={handleImpersonate}
                    onResetPassword={handleResetPassword}
                    onActivate={handleActivate}
                    onSuspend={(user) => {
                      setSelectedUser(user);
                      setIsSuspendModalOpen(true);
                    }}
                    onTransferOwnership={(user) => {
                      setSelectedUser(user);
                      setIsTransferModalOpen(true);
                    }}
                    onRemove={(user) => {
                      setSelectedUser(user);
                      setIsRemoveModalOpen(true);
                    }}
                  />
                ))}
              </UserTableHeader>
            </div>
          ) : (
            <UserTableEmpty
              onResetFilters={() => {
                setSearchQuery("");
                setRoleFilter("all-roles");
                setStatusFilter("all-status");
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <AdminInfoCard />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        newUser={newUser}
        onUserChange={setNewUser}
        onCreateUser={handleCreateUser}
        isPending={createUserMutation.isPending}
      />

      {/* Suspend User Modal */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onOpenChange={setIsSuspendModalOpen}
        selectedUserName={selectedUser?.name}
        onConfirm={handleSuspend}
        isPending={suspendMutation.isPending}
      />

      {/* Transfer Ownership Modal */}
      <TransferOwnershipModal
        isOpen={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
        users={users}
        selectedUserId={selectedUser?.id}
        transferTargetId={transferTargetId}
        onTransferTargetChange={setTransferTargetId}
        onConfirm={handleTransferOwnership}
        isPending={transferOwnershipMutation.isPending}
      />

      {/* Remove User Modal */}
      <RemoveUserModal
        isOpen={isRemoveModalOpen}
        onOpenChange={setIsRemoveModalOpen}
        selectedUserName={selectedUser?.name}
        onConfirm={handleRemoveUser}
        isPending={removeUserMutation.isPending}
      />
    </div>
  );
}

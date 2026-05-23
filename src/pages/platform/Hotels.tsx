import {
  usePlatformHotels,
  useUpdatePlatformHotel,
  useDeletePlatformHotel,
  useCreatePlatformHotel,
} from "@/hooks/usePlatformData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Ban,
  Loader2,
  FileDown,
  UserPlus,
  Key,
  ShieldAlert,
  Globe,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useNavigate, Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const PLAN_FILTER_LABELS: Record<string, string> = {
  all: "All Plans",
  enterprise: "Enterprise",
  pro: "Pro",
  basic: "Basic",
};

const SORT_OPTIONS = [
  { value: "name-asc", label: "Hotel name: A to Z" },
  { value: "name-desc", label: "Hotel name: Z to A" },
  { value: "rooms-asc", label: "Rooms: Low to High" },
  { value: "rooms-desc", label: "Rooms: High to Low" },
  { value: "created-desc", label: "Newest first" },
  { value: "created-asc", label: "Oldest first" },
] as const;

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  suspended: "Suspended",
  archived: "Archived",
};

type PlanFilterValue = keyof typeof PLAN_FILTER_LABELS;
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function PlatformHotels() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilterValue>("all");
  const [sortBy, setSortBy] = useState<SortValue>("name-asc");

  const {
    data: hotels,
    isLoading,
    isError,
    error,
    refetch,
  } = usePlatformHotels({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    plan: planFilter,
    sortBy: sortBy,
  });

  const createMutation = useCreatePlatformHotel();
  const updateMutation = useUpdatePlatformHotel();
  const deleteMutation = useDeletePlatformHotel();
  const navigate = useNavigate();
  const impersonate = useAuthStore.getState().impersonate;

  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [duplicatingHotel, setDuplicatingHotel] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, planFilter, sortBy]);

  const getTextValue = (...values: Array<string | null | undefined>) => {
    for (const value of values) {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) return trimmed;
      }
    }
    return "—";
  };

  const getNumericValue = (
    ...values: Array<string | number | null | undefined>
  ) => {
    for (const value of values) {
      if (typeof value === "number" && !Number.isNaN(value)) {
        return value;
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) continue;
        const parsed = Number(trimmed);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
    }
    return "—";
  };

  const handleEdit = (hotel: any) => {
    const planMap: Record<string, string> = {
      basic: "BASIC", Basic: "BASIC",
      pro: "PROFESSIONAL", Pro: "PROFESSIONAL",
      enterprise: "ENTERPRISE", Enterprise: "ENTERPRISE",
    };
    setEditingHotel({
      ...hotel,
      plan: planMap[hotel.plan] ?? hotel.plan,
      ownerName:
        getTextValue(hotel.ownerName, hotel.owner) === "—"
          ? ""
          : getTextValue(hotel.ownerName, hotel.owner),
      ownerEmail:
        getTextValue(hotel.ownerEmail, hotel.email) === "—"
          ? ""
          : getTextValue(hotel.ownerEmail, hotel.email),
    });
    setIsEditDialogOpen(true);
  };

  const handleDuplicate = async (hotel: any) => {
    try {
      const fullHotel = await api.get(`platform/hotels/${hotel.id}`);
      setDuplicatingHotel({
        ...fullHotel,
        name: `${fullHotel.name} (Copy)`,
        ownerEmail: `copy.${fullHotel.email}`,
        code: `${fullHotel.subdomain || fullHotel.name.toLowerCase().replace(/ /g, "-")}-copy`,
        password: "", // Start with empty password for admin to provide
      });
      setIsDuplicateDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch hotel details for duplication");
    }
  };

  const handleStatusChange = async (hotel: any, newStatus: string) => {
    // DB HotelStatus enum uses lowercase: 'active' | 'suspended'
    const statusValue = newStatus.toLowerCase();
    try {
      await updateMutation.mutateAsync({
        id: hotel.id,
        data: { status: statusValue },
      });
      toast.success(
        `Hotel ${statusValue === "active" ? "reactivated" : "suspended"} successfully`,
      );
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Failed to delete hotel");
    }
  };

  const handleUpdate = async () => {
    if (!editingHotel) return;

    // Normalize plan to DB enum value
    const planMap: Record<string, string> = {
      basic: "BASIC", Basic: "BASIC", BASIC: "BASIC",
      pro: "PROFESSIONAL", Pro: "PROFESSIONAL", PROFESSIONAL: "PROFESSIONAL",
      enterprise: "ENTERPRISE", Enterprise: "ENTERPRISE", ENTERPRISE: "ENTERPRISE",
    };
    const normalizedPlan = planMap[editingHotel.plan] ?? editingHotel.plan;

    try {
      await updateMutation.mutateAsync({
        id: editingHotel.id,
        data: editingHotel,
      });

      // Update subscription plan if hotel has an active subscription
      if (editingHotel.subscriptionId && normalizedPlan) {
        await api.patch(`platform/subscriptions/${editingHotel.subscriptionId}`, {
          plan: normalizedPlan,
        });
      }

      toast.success("Hotel updated successfully");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update hotel");
    }
  };

  const handleDuplicateSubmit = async () => {
    if (!duplicatingHotel) return;

    try {
      let planValue = duplicatingHotel.plan.toUpperCase();
      if (planValue === "PRO") planValue = "PROFESSIONAL";

      const payload = {
        name: duplicatingHotel.name.trim(),
        ownerName: duplicatingHotel.ownerName?.trim(),
        ownerEmail: duplicatingHotel.ownerEmail.trim(),
        password: duplicatingHotel.password,
        code: duplicatingHotel.code.trim(),
        rooms: duplicatingHotel.totalRooms || duplicatingHotel.rooms,
        plan: planValue,
        features: duplicatingHotel.enabledFeatures,
        primaryColor: duplicatingHotel.branding?.primaryColor,
        accentColor: duplicatingHotel.branding?.accentColor,
      };

      await createMutation.mutateAsync(payload);
      toast.success("Hotel duplicated successfully");
      setIsDuplicateDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to duplicate hotel");
    }
  };

  const handleImpersonate = async (hotel: any) => {
    try {
      await impersonate(hotel.id);
      toast.success(`Now impersonating ${hotel.name}`);
      navigate({ to: "/hotel/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Failed to impersonate");
    }
  };

  const handleSortChange = (value: string | null) => {
    setSortBy((value as SortValue) || "name-asc");
  };

  const handlePlanFilterChange = (value: string | null) => {
    setPlanFilter((value as PlanFilterValue) || "all");
  };

  const getRoomsCount = (hotel: any) => {
    const rooms = getNumericValue(hotel.totalRooms, hotel.rooms);
    return typeof rooms === "number" ? rooms : 0;
  };

  const totalPages = hotels?.totalPages ?? 0;
  const visibleHotels = hotels?.items ?? [];

  return (
    <div className='space-y-8'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
            Tenants
          </h1>
          <p className='text-sm text-muted-foreground'>
            Properties & subscriptions.
          </p>
        </div>
        <div className='flex gap-2 w-full sm:w-auto'>
          <Button
            variant='outline'
            className='flex-1 sm:flex-none gap-2 border-slate-200'
          >
            <FileDown className='w-4 h-4' /> Export
          </Button>
          <Button
            className='flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2'
            onClick={() => navigate({ to: "/platform/hotels/create" })}
          >
            <Plus className='w-4 h-4' /> Add
          </Button>
        </div>
      </div>

      <Card className='shadow-sm border-none bg-white'>
        <CardHeader className='border-b border-muted pb-4'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='relative flex-1 w-full md:max-w-sm'>
              <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search...'
                className='pl-9 bg-[#F8F7F4] border-none'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='flex gap-2 w-full md:w-auto'>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className='flex-1 md:w-44 h-9 bg-[#F8F7F4] border-none'>
                  <span>
                    {SORT_OPTIONS.find((option) => option.value === sortBy)
                      ?.label ?? "Sort by"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={handlePlanFilterChange}>
                <SelectTrigger className='flex-1 md:w-35 h-9 bg-[#F8F7F4] border-none'>
                  <span>{PLAN_FILTER_LABELS[planFilter] ?? "All Plans"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Plans</SelectItem>
                  <SelectItem value='enterprise'>Enterprise</SelectItem>
                  <SelectItem value='pro'>Pro</SelectItem>
                  <SelectItem value='basic'>Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0 overflow-hidden'>
          <Table>
            <TableHeader className='bg-[#F8F7F4]'>
              <TableRow>
                <TableHead className='w-75'>Property</TableHead>
                <TableHead className='hidden lg:table-cell'>Owner</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className='hidden sm:table-cell'>Rooms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='hidden xl:table-cell'>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-16 text-center'>
                    <div className='w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 animate-bounce'>
                      <ShieldAlert className='w-6 h-6 text-red-500' />
                    </div>
                    <p className='font-serif text-lg text-slate-800 font-bold'>
                      Unauthorized Connection or Session Expired
                    </p>
                    <p className='text-sm text-slate-400 mt-2 max-w-md mx-auto'>
                      {error?.message ||
                        "Verify you are properly signed in as Platform Super Admin to initialize tenant lookups."}
                    </p>
                    <div className='flex justify-center gap-3 mt-6'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => window.location.reload()}
                        className='border-slate-200'
                      >
                        Refresh Page
                      </Button>
                      <Button
                        size='sm'
                        onClick={() => refetch()}
                        className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
                      >
                        Retry Connection
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className='animate-pulse'>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg bg-slate-200' />
                        <div className='space-y-2 flex-1'>
                          <div className='h-4 bg-slate-200 rounded w-24' />
                          <div className='h-3 bg-slate-200 rounded w-28' />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <div className='space-y-2'>
                        <div className='h-4 bg-slate-200 rounded w-20' />
                        <div className='h-3 bg-slate-200 rounded w-24' />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='h-5 bg-slate-200 rounded w-14' />
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <div className='h-4 bg-slate-200 rounded w-8' />
                    </TableCell>
                    <TableCell>
                      <div className='h-6 bg-slate-200 rounded-full w-16' />
                    </TableCell>
                    <TableCell className='hidden xl:table-cell'>
                      <div className='h-4 bg-slate-200 rounded w-16' />
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='h-8 bg-slate-200 rounded w-8 ml-auto' />
                    </TableCell>
                  </TableRow>
                ))
              ) : !visibleHotels || visibleHotels.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='py-20 text-center animate-fade-in'
                  >
                    <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Search className='w-6 h-6 text-slate-300' />
                    </div>
                    <p className='font-serif text-lg text-slate-500'>
                      No properties found
                    </p>
                    <p className='text-sm text-slate-400'>
                      There are no operational hotel tenants seeded in system.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                visibleHotels.map((hotel) => (
                  <TableRow
                    key={hotel.id}
                    className='hover:bg-[#F8F7F4]/50 transition-colors cursor-pointer group border-b border-slate-50'
                    onClick={() =>
                      navigate({ to: `/platform/hotels/${hotel.id}` })
                    }
                  >
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg bg-[#0F1B2D]/5 flex items-center justify-center font-serif text-[#0F1B2D] font-bold'>
                          {hotel.name.charAt(0)}
                        </div>
                        <div>
                          <p className='font-bold text-[#0F1B2D] group-hover:text-[#C9973A] transition-colors'>
                            {hotel.name}
                          </p>
                          <p className='text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1'>
                            <Globe className='w-2 h-2' />{" "}
                            {hotel.name.toLowerCase().replace(/ /g, "-")}
                            .pms.cloud
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <div className='text-sm'>
                        <p className='font-medium text-[#0F1B2D]'>
                          {getTextValue(hotel.ownerName, hotel.owner)}
                        </p>
                        <p className='text-[10px] text-muted-foreground'>
                          {getTextValue(hotel.ownerEmail, hotel.email)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn(
                          "font-bold uppercase text-[9px] border-none px-2 py-0.5",
                          hotel.plan === "Enterprise"
                            ? "bg-[#0F1B2D] text-white"
                            : hotel.plan === "Pro"
                              ? "bg-[#C9973A] text-white"
                              : "bg-slate-200 text-slate-700",
                        )}
                      >
                        {hotel.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell text-sm font-serif'>
                      {getRoomsCount(hotel)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className='flex justify-start'>
                        <Select
                          value={hotel.status}
                          onValueChange={(value) =>
                            handleStatusChange(hotel, value)
                          }
                        >
                          <SelectTrigger className='h-8 w-32 bg-[#F8F7F4] border-slate-200 text-xs font-medium'>
                            <span>
                              {STATUS_LABELS[hotel.status] ?? hotel.status}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='active'>Active</SelectItem>
                            <SelectItem value='suspended'>Suspended</SelectItem>
                            <SelectItem value='archived'>Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className='hidden xl:table-cell text-[11px] text-muted-foreground font-medium'>
                      {hotel.created
                        ? format(new Date(hotel.created), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell
                      className='text-right'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className='flex items-center justify-end'>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={cn(
                              "h-8 w-8",
                              buttonVariants({
                                variant: "ghost",
                                size: "icon",
                              }),
                            )}
                          >
                            <MoreHorizontal className='w-4 h-4' />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-56'>
                            <DropdownMenuItem
                              className='gap-2'
                              onClick={() =>
                                navigate({
                                  to: `/platform/hotels/${hotel.id}`,
                                })
                              }
                            >
                              <Eye className='w-4 h-4' /> View Full Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='gap-2'
                              onClick={() => handleEdit(hotel)}
                            >
                              <Edit className='w-4 h-4' /> Quick Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='gap-2'
                              onClick={() => handleDuplicate(hotel)}
                            >
                              <Copy className='w-4 h-4' /> Duplicate Property
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='gap-2'
                              onClick={() => handleImpersonate(hotel)}
                            >
                              <ShieldAlert className='w-4 h-4' /> Impersonate
                              Owner
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='gap-2'
                              onClick={() =>
                                toast.info("Master password reset email sent")
                              }
                            >
                              <Key className='w-4 h-4' /> Reset Master Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {hotel.status === "active" ? (
                              <DropdownMenuItem
                                className='gap-2 text-amber-600'
                                onClick={() =>
                                  handleStatusChange(hotel, "suspended")
                                }
                              >
                                <Ban className='w-4 h-4' /> Suspend Tenant
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className='gap-2 text-green-600'
                                onClick={() =>
                                  handleStatusChange(hotel, "active")
                                }
                              >
                                <CheckCircle2 className='w-4 h-4' /> Reactivate
                                Tenant
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className='gap-2 text-red-600'
                              onClick={() => setDeleteTarget(hotel)}
                            >
                              <Trash2 className='w-4 h-4' /> Delete Tenant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Handled inline on TableBody */}
        </CardContent>
      </Card>

      <div className='flex flex-col items-center justify-center gap-4 mt-8'>
        <div className='flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className='h-9 px-4 border-slate-200 text-[#0F1B2D] hover:bg-[#0F1B2D] hover:text-white transition-colors'
          >
            Previous
          </Button>

          <div className='hidden md:flex items-center gap-1'>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, current, and pages around current
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, i, array) => (
                <React.Fragment key={page}>
                  {i > 0 && array[i - 1] !== page - 1 && (
                    <span className='px-2 text-slate-400'>...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size='sm'
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-9 w-9 p-0 font-medium transition-all",
                      currentPage === page
                        ? "bg-[#0F1B2D] text-white hover:bg-[#1a2a3a]"
                        : "border-slate-200 text-[#0F1B2D] hover:border-[#0F1B2D] hover:bg-[#0F1B2D]/5",
                    )}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}
          </div>

          <div className='md:hidden flex items-center px-4 font-medium text-sm text-[#0F1B2D]'>
            Page {currentPage} of {totalPages || 1}
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className='h-9 px-4 border-slate-200 text-[#0F1B2D] hover:bg-[#0F1B2D] hover:text-white transition-colors'
          >
            Next
          </Button>
        </div>
        <p className='text-[10px] text-muted-foreground uppercase tracking-wider font-bold'>
          Showing {visibleHotels?.length} of {hotels?.total ?? 0} properties
        </p>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-serif text-2xl'>
              Hotel Configuration
            </DialogTitle>
            <DialogDescription>
              Quickly update the most critical property settings.
            </DialogDescription>
          </DialogHeader>

          {editingHotel && (
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Hotel Name</Label>
                <Input
                  id='name'
                  value={editingHotel.name}
                  onChange={(e) =>
                    setEditingHotel({ ...editingHotel, name: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='owner'>Owner Name</Label>
                <Input
                  id='ownerName'
                  value={editingHotel.ownerName}
                  onChange={(e) =>
                    setEditingHotel({
                      ...editingHotel,
                      ownerName: e.target.value,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='rooms'>Rooms</Label>
                <Input
                  id='rooms'
                  type='number'
                  min='0'
                  value={editingHotel.rooms ?? ""}
                  onChange={(e) =>
                    setEditingHotel({
                      ...editingHotel,
                      rooms: Number(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='plan'>Subscription Plan</Label>
                  <Select
                    value={editingHotel.plan}
                    onValueChange={(val) =>
                      setEditingHotel({ ...editingHotel, plan: val })
                    }
                  >
                    <SelectTrigger id='plan'>
                      <SelectValue placeholder='Select plan' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='BASIC'>Basic</SelectItem>
                      <SelectItem value='PROFESSIONAL'>Professional</SelectItem>
                      <SelectItem value='ENTERPRISE'>Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='status'>Availability</Label>
                  <Select
                    value={editingHotel.status}
                    onValueChange={(val) =>
                      setEditingHotel({ ...editingHotel, status: val })
                    }
                  >
                    <SelectTrigger id='status'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='suspended'>Suspended</SelectItem>
                      <SelectItem value='archived'>Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant='ghost' onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                "Apply Updates"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-serif text-2xl'>
              Duplicate Property
            </DialogTitle>
            <DialogDescription>
              Create a new property based on "{duplicatingHotel?.name}". Unique
              fields must be updated.
            </DialogDescription>
          </DialogHeader>

          {duplicatingHotel && (
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='dup-name'>New Hotel Name</Label>
                <Input
                  id='dup-name'
                  value={duplicatingHotel.name}
                  onChange={(e) =>
                    setDuplicatingHotel({
                      ...duplicatingHotel,
                      name: e.target.value,
                    })
                  }
                  placeholder='Grand Peninsula (Copy)'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dup-code'>New Hotel Code (Slug)</Label>
                <Input
                  id='dup-code'
                  value={duplicatingHotel.code}
                  onChange={(e) =>
                    setDuplicatingHotel({
                      ...duplicatingHotel,
                      code: e.target.value,
                    })
                  }
                  placeholder='gp-copy'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dup-owner-email'>New Owner Email</Label>
                <Input
                  id='dup-owner-email'
                  type='email'
                  value={duplicatingHotel.ownerEmail}
                  onChange={(e) =>
                    setDuplicatingHotel({
                      ...duplicatingHotel,
                      ownerEmail: e.target.value,
                    })
                  }
                  placeholder='owner@newhotel.com'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dup-owner-name'>New Owner Name</Label>
                <Input
                  id='dup-owner-name'
                  value={duplicatingHotel.ownerName || ""}
                  onChange={(e) =>
                    setDuplicatingHotel({
                      ...duplicatingHotel,
                      ownerName: e.target.value,
                    })
                  }
                  placeholder='John Doe'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dup-password'>Temporary Password</Label>
                <Input
                  id='dup-password'
                  type='password'
                  value={duplicatingHotel.password}
                  onChange={(e) =>
                    setDuplicatingHotel({
                      ...duplicatingHotel,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dup-plan'>Subscription Plan</Label>
                <Select
                  value={duplicatingHotel.plan}
                  onValueChange={(val) =>
                    setDuplicatingHotel({ ...duplicatingHotel, plan: val })
                  }
                >
                  <SelectTrigger id='dup-plan'>
                    <SelectValue placeholder='Select plan' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Basic'>Basic</SelectItem>
                    <SelectItem value='Pro'>Pro</SelectItem>
                    <SelectItem value='Enterprise'>Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='ghost'
              onClick={() => setIsDuplicateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
              onClick={handleDuplicateSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                "Duplicate Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-serif text-2xl text-red-600'>
              Delete Tenant
            </DialogTitle>
            <DialogDescription className='pt-2'>
              Are you sure you want to permanently delete{" "}
              <span className='font-bold text-[#0F1B2D]'>
                "{deleteTarget?.name}"
              </span>
              ? This will remove all associated subscriptions, feature flags,
              user access, and the tenant schema.
              <span className='block mt-2 font-semibold text-red-600'>
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-4'>
            <Button
              variant='outline'
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className='bg-red-600 hover:bg-red-700 text-white gap-2'
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className='w-4 h-4' /> Confirm Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

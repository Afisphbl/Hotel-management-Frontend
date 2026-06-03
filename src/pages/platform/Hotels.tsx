import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  usePlatformHotels,
  useUpdatePlatformHotel,
  useDeletePlatformHotel,
  useCreatePlatformHotel,
} from "@/hooks/usePlatformData";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { HotelsHeader } from "@/components/platform/hotels-components/HotelsHeader";
import { HotelTable } from "@/components/platform/hotels-components/HotelTable";
import { HotelsPagination } from "@/components/platform/hotels-components/HotelsPagination";
import { EditHotelDialog } from "@/components/platform/hotels-components/EditHotelDialog";
import { DuplicateHotelDialog, type DuplicateHotelState } from "@/components/platform/hotels-components/DuplicateHotelDialog";
import { DeleteHotelDialog } from "@/components/platform/hotels-components/DeleteHotelDialog";
import { type Hotel, type PlanFilterValue, type SortValue, getTextValue, normalizePlan } from "@/components/platform/hotels-components/utils";

const ITEMS_PER_PAGE = 15;

export function PlatformHotels() {
  const navigate = useNavigate();
  const impersonate = useAuthStore.getState().impersonate;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilterValue>("all");
  const [sortBy, setSortBy] = useState<SortValue>("name-asc");

  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [duplicatingHotel, setDuplicatingHotel] = useState<DuplicateHotelState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Hotel | null>(null);

  const { data: hotels, isLoading, isError, error, refetch } = usePlatformHotels({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery,
    plan: planFilter,
    sortBy,
  });

  const createMutation = useCreatePlatformHotel();
  const updateMutation = useUpdatePlatformHotel();
  const deleteMutation = useDeletePlatformHotel();

  useEffect(() => { setCurrentPage(1); }, [searchQuery, planFilter, sortBy]);

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel({
      ...hotel,
      plan: normalizePlan(hotel.plan),
      ownerName: getTextValue(hotel.ownerName, hotel.owner) === "—" ? "" : getTextValue(hotel.ownerName, hotel.owner),
      ownerEmail: getTextValue(hotel.ownerEmail, hotel.email) === "—" ? "" : getTextValue(hotel.ownerEmail, hotel.email),
    });
  };

  const handleUpdate = async () => {
    if (!editingHotel) return;
    try {
      await updateMutation.mutateAsync({ id: editingHotel.id, data: editingHotel });
      if (editingHotel.subscriptionId) {
        await api.patch(`platform/subscriptions/${editingHotel.subscriptionId}`, {
          plan: normalizePlan(editingHotel.plan),
        });
      }
      toast.success("Hotel updated successfully");
      setEditingHotel(null);
      refetch();
    } catch {
      toast.error("Failed to update hotel");
    }
  };

  const handleDuplicate = async (hotel: Hotel) => {
    try {
      const full = await api.get(`platform/hotels/${hotel.id}`);
      setDuplicatingHotel({
        ...full,
        name: `${full.name} (Copy)`,
        ownerEmail: `copy.${full.email}`,
        code: `${full.subdomain || full.name.toLowerCase().replace(/ /g, "-")}-copy`,
        password: "",
      });
    } catch {
      toast.error("Failed to fetch hotel details for duplication");
    }
  };

  const handleDuplicateSubmit = async () => {
    if (!duplicatingHotel) return;
    try {
      let plan = duplicatingHotel.plan.toUpperCase();
      if (plan === "PRO") plan = "PROFESSIONAL";
      await createMutation.mutateAsync({
        name: duplicatingHotel.name.trim(),
        ownerName: duplicatingHotel.ownerName?.trim(),
        ownerEmail: duplicatingHotel.ownerEmail.trim(),
        password: duplicatingHotel.password,
        code: duplicatingHotel.code.trim(),
        rooms: duplicatingHotel.totalRooms || duplicatingHotel.rooms,
        plan,
        features: duplicatingHotel.enabledFeatures,
        primaryColor: (duplicatingHotel.branding as any)?.primaryColor,
        accentColor: (duplicatingHotel.branding as any)?.accentColor,
      });
      toast.success("Hotel duplicated successfully");
      setDuplicatingHotel(null);
      refetch();
    } catch (e: any) {
      toast.error(e.message || "Failed to duplicate hotel");
    }
  };

  const handleStatusChange = async (hotel: Hotel, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({ id: hotel.id, data: { status: newStatus.toLowerCase() } });
      toast.success(`Hotel ${newStatus === "active" ? "reactivated" : "suspended"} successfully`);
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete hotel");
    }
  };

  const handleImpersonate = async (hotel: Hotel) => {
    try {
      await impersonate(hotel.id);
      toast.success(`Now impersonating ${hotel.name}`);
      navigate({ to: "/hotel/dashboard" });
    } catch (e: any) {
      toast.error(e.message || "Failed to impersonate");
    }
  };

  const visibleHotels = hotels?.items ?? [];
  const totalPages = hotels?.totalPages ?? 0;

  return (
    <div className="space-y-8">
      <HotelsHeader />

      <HotelTable
        hotels={visibleHotels}
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onRefetch={refetch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        planFilter={planFilter}
        onPlanFilterChange={setPlanFilter}
        onView={(h) => navigate({ to: `/platform/hotels/${h.id}` })}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onImpersonate={handleImpersonate}
        onStatusChange={handleStatusChange}
        onDelete={setDeleteTarget}
      />

      <HotelsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={hotels?.total ?? 0}
        visibleCount={visibleHotels.length}
        onPageChange={setCurrentPage}
      />

      <EditHotelDialog
        hotel={editingHotel}
        open={!!editingHotel}
        onOpenChange={(open) => !open && setEditingHotel(null)}
        onChange={setEditingHotel}
        onSave={handleUpdate}
        isPending={updateMutation.isPending}
      />

      <DuplicateHotelDialog
        hotel={duplicatingHotel}
        open={!!duplicatingHotel}
        onOpenChange={(open) => !open && setDuplicatingHotel(null)}
        onChange={setDuplicatingHotel}
        onSubmit={handleDuplicateSubmit}
        isPending={createMutation.isPending}
      />

      <DeleteHotelDialog
        hotel={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

import { useState, useMemo } from "react";
import {
  usePlatformSubscriptions, useTopSubscriptions,
  useUpdatePlatformSubscription, useDeletePlatformSubscription,
  useCreatePlatformSubscription,
} from "@/hooks/usePlatformData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Database, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { PlanCard } from "@/components/subscriptions/PlanCard";
import { PlanFilters } from "@/components/subscriptions/PlanFilters";
import { TopPropertiesTable } from "@/components/subscriptions/TopPropertiesTable";
import { AddTierDialog, type NewTier } from "@/components/subscriptions/AddTierDialog";
import { EditPlanDialog, type EditingPlan } from "@/components/subscriptions/EditPlanDialog";
import { DeletePlanDialog } from "@/components/subscriptions/DeletePlanDialog";

const DEFAULT_TIER: NewTier = { plan: "BASIC", price: 0, features: "" };

export function PlatformSubscriptions() {
  const { data: plans, isLoading: plansLoading, isError: plansError, refetch } = usePlatformSubscriptions();
  const { data: topSubs, isLoading: topLoading } = useTopSubscriptions();
  const updateMutation = useUpdatePlatformSubscription();
  const deleteMutation = useDeletePlatformSubscription();
  const createMutation = useCreatePlatformSubscription();

  const [editingPlan, setEditingPlan] = useState<EditingPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [addTierOpen, setAddTierOpen] = useState(false);
  const [newTier, setNewTier] = useState<NewTier>(DEFAULT_TIER);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  const filteredPlans = useMemo(() => {
    if (!plans) return [];
    return plans.filter((p: any) => {
      const name = (p.name || p.plan || "").toLowerCase();
      const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
      const matchesPlan = planFilter === "all" || (p.plan || "").toUpperCase() === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [plans, searchQuery, planFilter]);

  const handleEdit = (plan: any) => {
    const features = Array.isArray(plan.features)
      ? plan.features.join(", ")
      : Array.isArray(plan.featureList)
        ? plan.featureList.join(", ")
        : (plan.features?.enabledFeatures ?? []).join(", ");
    setEditingPlan({ id: plan.id, name: plan.name || plan.plan || "", price: plan.price ?? plan.amount ?? 0, features });
  };

  const handleUpdate = async () => {
    if (!editingPlan) return;
    try {
      await updateMutation.mutateAsync({
        id: editingPlan.id,
        data: {
          name: editingPlan.name,
          plan: editingPlan.name,
          price: Number(editingPlan.price),
          features: { enabledFeatures: editingPlan.features.split(",").map((f) => f.trim()).filter(Boolean) },
        },
      });
      toast.success("Plan updated successfully");
      setEditingPlan(null);
      refetch();
    } catch { toast.error("Failed to update plan"); }
  };

  const handleAddTier = async () => {
    try {
      await createMutation.mutateAsync({
        plan: newTier.plan,
        price: Number(newTier.price),
        features: { enabledFeatures: newTier.features.split(",").map((f) => f.trim()).filter(Boolean) },
      });
      toast.success("New tier created successfully");
      setAddTierOpen(false);
      setNewTier(DEFAULT_TIER);
      refetch();
    } catch { toast.error("Failed to create tier"); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch { toast.error("Failed to delete plan"); }
  };

  const topHotels = Array.isArray(topSubs) ? topSubs : Array.isArray(topSubs?.items) ? topSubs.items : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Plans</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage tiers and pricing models.</p>
        </div>
        <Button className="w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={() => setAddTierOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Tier
        </Button>
      </div>

      <PlanFilters
        searchQuery={searchQuery}
        planFilter={planFilter}
        onSearchChange={setSearchQuery}
        onPlanFilterChange={setPlanFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-sm border-none bg-white">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))
        ) : plansError ? (
          <Card className="md:col-span-3 shadow-sm border-none bg-white">
            <CardContent className="p-12 text-center text-muted-foreground">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Failed to load subscription plans.</p>
              <p className="text-xs text-slate-400 mt-1">The data might not be available from the server.</p>
            </CardContent>
          </Card>
        ) : filteredPlans.length > 0 ? (
          filteredPlans.map((plan: any) => (
            <PlanCard key={plan.id} plan={plan} onEdit={handleEdit} onDelete={setDeleteTarget} />
          ))
        ) : (
          <Card className="md:col-span-3 shadow-sm border-none bg-white">
            <CardContent className="p-12 text-center text-muted-foreground">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No subscription plans configured.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <TopPropertiesTable hotels={topHotels} isLoading={topLoading} />

      <AddTierDialog
        open={addTierOpen}
        onOpenChange={(open) => { setAddTierOpen(open); if (!open) setNewTier(DEFAULT_TIER); }}
        value={newTier}
        onChange={setNewTier}
        onSubmit={handleAddTier}
        isPending={createMutation.isPending}
      />

      <EditPlanDialog
        plan={editingPlan}
        onChange={setEditingPlan}
        onClose={() => setEditingPlan(null)}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />

      <DeletePlanDialog
        plan={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

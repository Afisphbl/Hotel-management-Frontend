import React, { useState, useMemo, useCallback } from "react";
import {
  usePlatformGlobalFeatureFlags,
  useCreateFeatureFlag,
  useUpdateFeatureFlag,
  useDeleteFeatureFlag,
  useToggleFeatureFlag,
  useFeatureFlagRolloutSummary,
} from "@/hooks/usePlatformData";
import { toast } from "sonner";

import { FlagToolbar } from "./components/FlagToolbar";
import { FlagTable } from "./components/FlagTable";
import { FlagPagination } from "./components/FlagPagination";
import { ActiveExperimentsCard } from "./components/ActiveExperimentsCard";
import { RolloutStatusCard } from "./components/RolloutStatusCard";
import { CreateFlagDialog } from "./components/CreateFlagDialog";
import { EditFlagDialog } from "./components/EditFlagDialog";
import { DeleteFlagDialog } from "./components/DeleteFlagDialog";
import type { FlagFormData, FeatureFlag, RolloutItem } from "./utils/flagTypes";
import type { EditingFlag } from "./components/EditFlagDialog";

const DEFAULT_FORM: FlagFormData = {
  name: "",
  description: "",
  status: "DISABLED",
  rolloutStrategy: "full_rollout",
  rolloutPercentage: 50,
};

export function PlatformFeatureFlags() {
  // ── Filter & pagination state ──────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");

  // ── Dialog state ───────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<EditingFlag | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FeatureFlag | null>(null);
  const [formData, setFormData] = useState<FlagFormData>(DEFAULT_FORM);

  // ── Data hooks ─────────────────────────────────────────────────────────────
  const { data: pageData, isLoading, isError, error, refetch } =
    usePlatformGlobalFeatureFlags({
      page,
      limit: 10,
      search: searchQuery || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      strategy: strategyFilter !== "all" ? strategyFilter : undefined,
      scope: scopeFilter !== "all" ? scopeFilter : undefined,
    });

  const { data: rolloutData } = useFeatureFlagRolloutSummary();
  const createMutation = useCreateFeatureFlag();
  const updateMutation = useUpdateFeatureFlag();
  const deleteMutation = useDeleteFeatureFlag();
  const toggleMutation = useToggleFeatureFlag();

  const flags: FeatureFlag[] = pageData?.items || [];
  const total: number = pageData?.total || 0;
  const totalPages: number = pageData?.totalPages || 0;

  // ── Derived data ───────────────────────────────────────────────────────────
  const activeExperiments = useMemo(
    () =>
      flags.filter(
        (f) => f.rolloutStrategy === "a_b_test" && f.status !== "DISABLED"
      ),
    [flags]
  );

  const rolloutItems = useMemo<RolloutItem[]>(() => {
    if (!rolloutData) return [];
    return (rolloutData as RolloutItem[])
      .filter((r) => r.percentage > 0 || r.status === "ENABLED")
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }, [rolloutData]);

  const hasActiveFilters =
    !!searchQuery ||
    statusFilter !== "all" ||
    strategyFilter !== "all" ||
    scopeFilter !== "all";

  // ── Filter handlers (reset page on change) ─────────────────────────────────
  const handleSearch = useCallback((val: string) => {
    setSearchQuery(val);
    setPage(1);
  }, []);
  const handleStatusFilter = useCallback((val: string) => {
    setStatusFilter(val);
    setPage(1);
  }, []);
  const handleStrategyFilter = useCallback((val: string) => {
    setStrategyFilter(val);
    setPage(1);
  }, []);
  const handleScopeFilter = useCallback((val: string) => {
    setScopeFilter(val);
    setPage(1);
  }, []);

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const resetForm = useCallback(() => setFormData(DEFAULT_FORM), []);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Flag name is required");
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        rolloutStrategy:
          formData.rolloutStrategy === "full_rollout"
            ? undefined
            : formData.rolloutStrategy,
        rolloutPercentage:
          formData.rolloutStrategy === "percentage"
            ? formData.rolloutPercentage
            : undefined,
      });
      toast.success(`Feature flag "${formData.name}" created`);
      setCreateOpen(false);
      resetForm();
      refetch();
    } catch {
      toast.error("Failed to create feature flag");
    }
  };

  const handleUpdate = async () => {
    if (!editingFlag) return;
    try {
      await updateMutation.mutateAsync({
        id: editingFlag.id,
        data: {
          description: editingFlag.description || undefined,
          status: editingFlag.status,
          rolloutStrategy:
            editingFlag.rolloutStrategy === "full_rollout"
              ? undefined
              : editingFlag.rolloutStrategy,
          rolloutPercentage:
            editingFlag.rolloutStrategy === "percentage"
              ? editingFlag.rolloutPercentage
              : undefined,
        },
      });
      toast.success(`Feature flag "${editingFlag.name}" updated`);
      setEditingFlag(null);
      refetch();
    } catch {
      toast.error("Failed to update feature flag");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Feature flag "${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      refetch();
    } catch {
      toast.error("Failed to delete feature flag");
    }
  };

  const handleToggle = async (flag: FeatureFlag) => {
    try {
      await toggleMutation.mutateAsync(flag.id);
      const newStatus = flag.status === "ENABLED" ? "disabled" : "enabled";
      toast.success(`Feature flag "${flag.name}" ${newStatus}`);
    } catch {
      toast.error("Failed to toggle feature flag");
    }
  };

  const openEdit = (flag: FeatureFlag) => {
    setEditingFlag({
      id: flag.id,
      name: flag.name,
      description: flag.description || "",
      status: flag.status || "DISABLED",
      rolloutStrategy: flag.rolloutStrategy || "full_rollout",
      rolloutPercentage: flag.rolloutPercentage ?? 50,
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <FlagToolbar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        strategyFilter={strategyFilter}
        scopeFilter={scopeFilter}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onStrategyFilter={handleStrategyFilter}
        onScopeFilter={handleScopeFilter}
        onCreateClick={() => { resetForm(); setCreateOpen(true); }}
      />

      <FlagTable
        flags={flags}
        isLoading={isLoading}
        isError={isError}
        error={error as { message?: string } | null}
        onRetry={refetch}
        isToggling={toggleMutation.isPending}
        hasActiveFilters={hasActiveFilters}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onToggle={handleToggle}
      />

      <FlagPagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActiveExperimentsCard experiments={activeExperiments} />
        <RolloutStatusCard rolloutItems={rolloutItems} />
      </div>

      <CreateFlagDialog
        open={createOpen}
        onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}
        formData={formData}
        setFormData={setFormData}
        onCreate={handleCreate}
        isPending={createMutation.isPending}
      />

      <EditFlagDialog
        flag={editingFlag}
        onChange={setEditingFlag}
        onSave={handleUpdate}
        onClose={() => setEditingFlag(null)}
        isPending={updateMutation.isPending}
      />

      <DeleteFlagDialog
        flag={deleteTarget}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

import React, { useState, useMemo, useCallback } from "react";
import {
  usePlatformGlobalFeatureFlags,
  useCreateFeatureFlag,
  useUpdateFeatureFlag,
  useDeleteFeatureFlag,
  useToggleFeatureFlag,
  useFeatureFlagRolloutSummary,
} from "@/hooks/usePlatformData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Flag,
  Search,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  Loader2,
  X,
  FlaskConical,
  Gauge,
  Globe,
  Building2,
  ToggleLeft,
  ChevronLeft,
  ChevronRight,
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

const rolloutStrategyLabels: Record<string, string> = {
  full_rollout: "Full Rollout",
  percentage: "Percentage",
  user_based: "User Based",
  role_based: "Role Based",
  conditional: "Conditional",
  a_b_test: "A/B Test",
};

export function PlatformFeatureFlags() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");

  const { data: pageData, isLoading, isError, error, refetch } = usePlatformGlobalFeatureFlags({
    page,
    limit: 10,
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    strategy: strategyFilter !== "all" ? strategyFilter : undefined,
    scope: scopeFilter !== "all" ? scopeFilter : undefined,
  });

  const flags = pageData?.items || [];
  const total = pageData?.total || 0;
  const totalPages = pageData?.totalPages || 0;

  const { data: rolloutData } = useFeatureFlagRolloutSummary();
  const createMutation = useCreateFeatureFlag();
  const updateMutation = useUpdateFeatureFlag();
  const deleteMutation = useDeleteFeatureFlag();
  const toggleMutation = useToggleFeatureFlag();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "DISABLED",
    rolloutStrategy: "full_rollout",
    rolloutPercentage: 50,
  });

  const activeExperiments = useMemo(() => {
    if (!flags) return [];
    return flags.filter((f: any) => f.rolloutStrategy === "a_b_test" && f.status !== "DISABLED");
  }, [flags]);

  const rolloutItems = useMemo(() => {
    if (!rolloutData) return [];
    return rolloutData
      .filter((r: any) => r.percentage > 0 || r.status === 'ENABLED')
      .sort((a: any, b: any) => b.percentage - a.percentage)
      .slice(0, 5);
  }, [rolloutData]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "enabled":
      case "active":
        return <CheckCircle2 className='w-4 h-4 text-green-600' />;
      case "disabled":
      case "inactive":
        return <XCircle className='w-4 h-4 text-slate-400' />;
      case "scheduled":
        return <AlertCircle className='w-4 h-4 text-amber-500' />;
      default:
        return <AlertCircle className='w-4 h-4 text-slate-400' />;
    }
  };

  const getScopeBadge = (flag: any) => {
    if (flag.hotel) {
      return (
        <Badge variant='outline' className='bg-white border-slate-200 text-slate-600 font-bold text-[10px] uppercase gap-1'>
          <Building2 className='w-3 h-3' />
          Hotel
        </Badge>
      );
    }
    return (
      <Badge variant='outline' className='bg-blue-50 border-blue-200 text-blue-700 font-bold text-[10px] uppercase gap-1'>
        <Globe className='w-3 h-3' />
        Global
      </Badge>
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "enabled": return "text-green-600";
      case "disabled": return "text-slate-400";
      case "scheduled": return "text-amber-500";
      default: return "text-slate-400";
    }
  };

  const getRolloutBarColor = (pct: number) => {
    if (pct >= 100) return "bg-green-500";
    if (pct >= 50) return "bg-[#C9973A]";
    return "bg-amber-400";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "DISABLED",
      rolloutStrategy: "full_rollout",
      rolloutPercentage: 50,
    });
  };

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
        rolloutStrategy: formData.rolloutStrategy === "full_rollout" ? undefined : formData.rolloutStrategy,
        rolloutPercentage: formData.rolloutStrategy === "percentage" ? formData.rolloutPercentage : undefined,
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
          rolloutStrategy: editingFlag.rolloutStrategy === "full_rollout" ? undefined : editingFlag.rolloutStrategy,
          rolloutPercentage: editingFlag.rolloutStrategy === "percentage" ? editingFlag.rolloutPercentage : undefined,
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

  const handleToggle = async (flag: any) => {
    try {
      await toggleMutation.mutateAsync(flag.id);
      const newStatus = flag.status === "ENABLED" ? "disabled" : "enabled";
      toast.success(`Feature flag "${flag.name}" ${newStatus}`);
    } catch {
      toast.error("Failed to toggle feature flag");
    }
  };

  const openEdit = (flag: any) => {
    setEditingFlag({
      id: flag.id,
      name: flag.name,
      description: flag.description || "",
      status: flag.status || "DISABLED",
      rolloutStrategy: flag.rolloutStrategy || "full_rollout",
      rolloutPercentage: flag.rolloutPercentage ?? 50,
    });
  };

  const formatStrategy = (strategy: string | null | undefined) => {
    if (!strategy || strategy === "full_rollout") return "Full Rollout";
    return rolloutStrategyLabels[strategy] || strategy;
  };

  const formatStatus = (status: string) => {
    return status ? status.charAt(0) + status.slice(1).toLowerCase() : "Unknown";
  };

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

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
            Flags
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Global rollouts & canaries.
          </p>
        </div>
        <Button
          className='w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]'
          onClick={() => { resetForm(); setCreateOpen(true); }}
        >
          <Plus className='w-4 h-4 mr-2' /> Create Flag
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search flags...'
            className='pl-9 bg-white border-none shadow-sm'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
        <Select value={scopeFilter} onValueChange={(v) => v && handleScopeFilter(v)}>
          <SelectTrigger className='w-28 bg-white border-none shadow-sm'>
            <SelectValue placeholder='Scope' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Scopes</SelectItem>
            <SelectItem value='global'>Global</SelectItem>
            <SelectItem value='hotel'>Per Hotel</SelectItem>
          </SelectContent>
        </Select>
        <div className='flex gap-1 p-1 bg-slate-100 rounded-lg self-start'>
          {STATUS_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => handleStatusFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                statusFilter === type
                  ? 'bg-white text-[#0F1B2D] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
        <Select value={strategyFilter} onValueChange={(v) => v && handleStrategyFilter(v)}>
          <SelectTrigger className='w-40 bg-white border-none shadow-sm'>
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

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow className='bg-slate-50/50'>
                <TableHead className='pl-6'>Flag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='hidden sm:table-cell'>Scope</TableHead>
                <TableHead className='hidden lg:table-cell'>Hotel</TableHead>
                <TableHead className='hidden lg:table-cell'>Strategy</TableHead>
                <TableHead className='hidden md:table-cell w-[250px]'>
                  Description
                </TableHead>
                <TableHead className='text-right pr-6'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-12 text-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <AlertCircle className='w-6 h-6 text-red-400' />
                      <p className='text-sm text-red-500'>{error?.message || 'Failed to load feature flags'}</p>
                      <Button variant='outline' size='sm' onClick={() => refetch()}>Retry</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className='animate-pulse'>
                    <TableCell className='pl-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded bg-slate-200' />
                        <div className='h-4 bg-slate-200 rounded w-28' />
                      </div>
                    </TableCell>
                    <TableCell><div className='h-4 bg-slate-200 rounded w-16' /></TableCell>
                    <TableCell className='hidden sm:table-cell'><div className='h-5 bg-slate-200 rounded w-14' /></TableCell>
                    <TableCell className='hidden lg:table-cell'><div className='h-4 bg-slate-200 rounded w-20' /></TableCell>
                    <TableCell className='hidden lg:table-cell'><div className='h-5 bg-slate-200 rounded w-20' /></TableCell>
                    <TableCell className='hidden md:table-cell'><div className='h-4 bg-slate-200 rounded w-32' /></TableCell>
                    <TableCell className='text-right pr-6'><div className='h-8 bg-slate-200 w-20 rounded ml-auto' /></TableCell>
                  </TableRow>
                ))
              ) : !flags || flags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-12 text-center animate-fade-in'>
                    <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <Flag className='w-5 h-5 text-slate-300' />
                    </div>
                    <p className='font-serif text-base text-slate-500'>
                      No feature flags found
                    </p>
                    <p className='text-xs text-slate-400'>
                      {searchQuery || statusFilter !== 'all' || strategyFilter !== 'all' || scopeFilter !== 'all'
                        ? 'Try adjusting your search or filters.'
                        : 'Add global flags to control tenant rolling options.'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                flags.map((flag: any) => (
                  <TableRow
                    key={flag.id || flag.key}
                    className='group hover:bg-slate-50/50 transition-colors'
                  >
                    <TableCell className='pl-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='hidden sm:flex p-2 bg-slate-100 rounded group-hover:bg-[#C9973A]/10 transition-colors'>
                          <Flag className='w-4 h-4 text-slate-500 group-hover:text-[#C9973A]' />
                        </div>
                        <span className='font-bold text-xs sm:text-sm text-[#0F1B2D]'>
                          {flag.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {getStatusIcon(flag.status)}
                        <span className={`capitalize text-[10px] sm:text-sm font-medium ${getStatusBadgeColor(flag.status)}`}>
                          {formatStatus(flag.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      {getScopeBadge(flag)}
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      {flag.hotel ? (
                        <span className='text-xs text-muted-foreground font-medium'>
                          {flag.hotel.name}
                        </span>
                      ) : (
                        <span className='text-xs text-slate-300 italic'>—</span>
                      )}
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <span className='text-xs text-muted-foreground'>
                        {formatStrategy(flag.rolloutStrategy)}
                      </span>
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
                        {flag.description || "—"}
                      </p>
                    </TableCell>
                    <TableCell className='text-right pr-6'>
                      <div className='flex items-center justify-end gap-2'>
                        <Switch
                          size='sm'
                          checked={flag.status === 'ENABLED'}
                          onCheckedChange={() => handleToggle(flag)}
                          disabled={toggleMutation.isPending}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant='ghost' size='icon' className='h-8 w-8' />
                            }
                          >
                            <MoreVertical className='w-4 h-4' />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-44'>
                            <DropdownMenuItem className='gap-2' onClick={() => openEdit(flag)}>
                              <Edit className='w-4 h-4' /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className='gap-2' onClick={() => handleToggle(flag)}>
                              <ToggleLeft className='w-4 h-4' /> Toggle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='gap-2 text-red-600'
                              onClick={() => setDeleteTarget(flag)}
                            >
                              <Trash2 className='w-4 h-4' /> Delete
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
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <p className='text-xs text-muted-foreground'>
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='bg-white border-none shadow-sm'
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const n = start + i;
              if (n > totalPages) return null;
              return (
                <Button
                  key={n}
                  variant={n === page ? 'default' : 'outline'}
                  size='sm'
                  className={
                    n === page
                      ? 'bg-[#0F1B2D] hover:bg-[#1a2a3a] min-w-[32px]'
                      : 'bg-white border-none shadow-sm min-w-[32px]'
                  }
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              );
            })}
            <Button
              variant='outline'
              size='sm'
              className='bg-white border-none shadow-sm'
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='shadow-sm border-none bg-white'>
          <CardHeader>
            <CardTitle className='font-serif text-lg flex items-center gap-2'>
              <FlaskConical className='w-4 h-4 text-blue-500' />
              Active Experiments
            </CardTitle>
            <CardDescription>
              Currently running A/B tests across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {activeExperiments.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <FlaskConical className='w-8 h-8 mx-auto mb-2 opacity-30' />
                <p className='text-sm'>No active A/B test experiments.</p>
                <p className='text-xs text-slate-400 mt-1'>
                  Create a flag with "A/B Test" rollout strategy to start one.
                </p>
              </div>
            ) : (
              activeExperiments.map((exp: any) => (
                <div
                  key={exp.id}
                  className='flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
                      <FlaskConical className='w-5 h-5' />
                    </div>
                    <div>
                      <p className='text-sm font-bold'>{exp.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {exp.variants?.length
                          ? `${exp.variants.length} variants • `
                          : ''}
                        Strategy: {formatStrategy(exp.rolloutStrategy)}
                      </p>
                    </div>
                  </div>
                  <Badge className='bg-blue-600'>
                    {exp.status === 'ENABLED' ? 'A/B Test' : formatStatus(exp.status)}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className='shadow-sm border-none bg-white'>
          <CardHeader>
            <CardTitle className='font-serif text-lg flex items-center gap-2'>
              <Gauge className='w-4 h-4 text-[#C9973A]' />
              Global Rollout Status
            </CardTitle>
            <CardDescription>
              Rollout progress across all hotels.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {rolloutItems.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <Gauge className='w-8 h-8 mx-auto mb-2 opacity-30' />
                <p className='text-sm'>No rollout data available.</p>
                <p className='text-xs text-slate-400 mt-1'>
                  Enable feature flags to see their rollout status here.
                </p>
              </div>
            ) : (
              rolloutItems.map((item: any) => (
                <div key={item.name} className='space-y-2'>
                  <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                    <span className='font-bold uppercase tracking-widest'>
                      {item.name}
                    </span>
                    <span className='font-bold text-[#0F1B2D]'>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className='h-2 w-full bg-slate-100 rounded-full overflow-hidden'>
                    <div
                      className={`h-full ${getRolloutBarColor(item.percentage)} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-serif text-2xl'>Create Feature Flag</DialogTitle>
            <DialogDescription>Define a new feature flag for the platform.</DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='flag-name'>Name</Label>
              <Input
                id='flag-name'
                placeholder='e.g. new-booking-flow'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='flag-desc'>Description</Label>
              <Input
                id='flag-desc'
                placeholder='What does this flag control?'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='flag-status'>Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => v && setFormData({ ...formData, status: v })}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='DISABLED'>Disabled</SelectItem>
                  <SelectItem value='ENABLED'>Enabled</SelectItem>
                  <SelectItem value='SCHEDULED'>Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='flag-strategy'>Rollout Strategy</Label>
              <Select
                value={formData.rolloutStrategy}
                onValueChange={(v) => v && setFormData({ ...formData, rolloutStrategy: v })}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STRATEGY_OPTIONS.filter((s) => s.value !== "all").map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.rolloutStrategy === "percentage" && (
              <div className='space-y-2'>
                <Label htmlFor='flag-pct'>Rollout Percentage</Label>
                <Input
                  id='flag-pct'
                  type='number'
                  min={0}
                  max={100}
                  value={formData.rolloutPercentage}
                  onChange={(e) => setFormData({ ...formData, rolloutPercentage: Number(e.target.value) })}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant='ghost' onClick={() => { setCreateOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button
              className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
              onClick={handleCreate}
              disabled={createMutation.isPending || !formData.name.trim()}
            >
              {createMutation.isPending ? (
                <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Creating...</>
              ) : (
                'Create Flag'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingFlag} onOpenChange={(open) => !open && setEditingFlag(null)}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-serif text-2xl'>Edit Feature Flag</DialogTitle>
            <DialogDescription>Update the feature flag configuration.</DialogDescription>
          </DialogHeader>

          {editingFlag && (
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label>Name</Label>
                <p className='text-sm font-medium text-[#0F1B2D] px-3 py-2 bg-slate-50 rounded-lg'>{editingFlag.name}</p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-desc'>Description</Label>
                <Input
                  id='edit-desc'
                  value={editingFlag.description}
                  onChange={(e) => setEditingFlag({ ...editingFlag, description: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-status'>Status</Label>
                <Select
                  value={editingFlag.status}
                  onValueChange={(v) => v && setEditingFlag({ ...editingFlag, status: v })}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='DISABLED'>Disabled</SelectItem>
                    <SelectItem value='ENABLED'>Enabled</SelectItem>
                    <SelectItem value='SCHEDULED'>Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-strategy'>Rollout Strategy</Label>
                <Select
                  value={editingFlag.rolloutStrategy}
                  onValueChange={(v) => v && setEditingFlag({ ...editingFlag, rolloutStrategy: v })}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STRATEGY_OPTIONS.filter((s) => s.value !== "all").map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {editingFlag.rolloutStrategy === "percentage" && (
                <div className='space-y-2'>
                  <Label htmlFor='edit-pct'>Rollout Percentage</Label>
                  <Input
                    id='edit-pct'
                    type='number'
                    min={0}
                    max={100}
                    value={editingFlag.rolloutPercentage}
                    onChange={(e) => setEditingFlag({ ...editingFlag, rolloutPercentage: Number(e.target.value) })}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant='ghost' onClick={() => setEditingFlag(null)}>
              Cancel
            </Button>
            <Button
              className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Saving...</>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-serif text-2xl text-red-600'>
              Delete Feature Flag
            </DialogTitle>
            <DialogDescription className='pt-2'>
              Are you sure you want to permanently delete{' '}
              <span className='font-bold text-[#0F1B2D]'>
                "{deleteTarget?.name}"
              </span>
              ? This action cannot be undone.
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
                <><Loader2 className='w-4 h-4 animate-spin' /> Deleting...</>
              ) : (
                <><Trash2 className='w-4 h-4' /> Confirm Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
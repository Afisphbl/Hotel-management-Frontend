import React, { useState, useMemo } from 'react';
import {
  usePlatformSubscriptions,
  useTopSubscriptions,
  useUpdatePlatformSubscription,
  useDeletePlatformSubscription,
  useCreatePlatformSubscription,
} from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  CreditCard,
  Check,
  Settings,
  MoreVertical,
  Database,
  Edit,
  Trash2,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function PlatformSubscriptions() {
  const { data: plans, isLoading: plansLoading, isError: plansError, refetch } = usePlatformSubscriptions();
  const { data: topSubs, isLoading: topLoading } = useTopSubscriptions();

  const updateMutation = useUpdatePlatformSubscription();
  const deleteMutation = useDeletePlatformSubscription();
  const createMutation = useCreatePlatformSubscription();

  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [addTierOpen, setAddTierOpen] = useState(false);
  const [newTier, setNewTier] = useState({ plan: 'BASIC', price: 0, features: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  const filteredPlans = useMemo(() => {
    if (!plans) return [];
    return plans.filter((p: any) => {
      const name = (p.name || p.plan || '').toLowerCase();
      const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
      const matchesPlan = planFilter === 'all' || (p.plan || '').toUpperCase() === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [plans, searchQuery, planFilter]);

  const handleEdit = (plan: any) => {
    const features = Array.isArray(plan.features)
      ? plan.features.join(', ')
      : Array.isArray(plan.featureList)
        ? plan.featureList.join(', ')
        : plan.features?.enabledFeatures
          ? plan.features.enabledFeatures.join(', ')
          : '';
    setEditingPlan({
      id: plan.id,
      name: plan.name || plan.plan || '',
      price: plan.price ?? plan.amount ?? 0,
      features,
    });
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
          features: { enabledFeatures: editingPlan.features.split(',').map((f: string) => f.trim()).filter(Boolean) },
        },
      });
      toast.success('Plan updated successfully');
      setEditingPlan(null);
      refetch();
    } catch {
      toast.error('Failed to update plan');
    }
  };

  const handleAddTier = async () => {
    try {
      await createMutation.mutateAsync({
        plan: newTier.plan,
        price: Number(newTier.price),
        features: { enabledFeatures: newTier.features.split(',').map((f: string) => f.trim()).filter(Boolean) },
      });
      toast.success('New tier created successfully');
      setAddTierOpen(false);
      setNewTier({ plan: 'BASIC', price: 0, features: '' });
      refetch();
    } catch {
      toast.error('Failed to create tier');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete plan');
    }
  };

  const topHotels = Array.isArray(topSubs)
    ? topSubs
    : Array.isArray(topSubs?.items)
      ? topSubs.items
      : [];

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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search plans..."
            className="pl-9 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg self-start">
          {['all', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE'].map((type) => (
            <button
              key={type}
              onClick={() => setPlanFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                planFilter === type
                  ? 'bg-white text-[#0F1B2D] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type === 'all' ? 'All' : type === 'PROFESSIONAL' ? 'Pro' : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

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
            <Card key={plan.id} className="shadow-sm border-none bg-white relative overflow-hidden group flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#C9973A] opacity-20 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-serif text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.hotels ?? plan.activeProperties ?? 0} Active Properties</CardDescription>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-[#C9973A]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 flex flex-col flex-1">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#0F1B2D]">{formatCurrency(plan.price ?? plan.amount ?? 0)}</span>
                    <span className="text-sm text-muted-foreground">/per month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Included Features</p>
                  <ul className="space-y-2">
                    {(Array.isArray(plan.features) ? plan.features : Array.isArray(plan.featureList) ? plan.featureList : plan.features?.enabledFeatures ?? []).map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-green-600" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => handleEdit(plan)}
                  >
                    Edit Plan
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="h-9 w-9" />
                      }
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem className="gap-2" onClick={() => handleEdit(plan)}>
                        <Edit className="w-4 h-4" /> Quick Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-red-600"
                        onClick={() => setDeleteTarget(plan)}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
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

      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Top Subscribing Properties</CardTitle>
          <CardDescription>A list of hotels by their revenue contribution.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead className="hidden sm:table-cell">Plan</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-14" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : topHotels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No active properties found.
                  </TableCell>
                </TableRow>
              ) : (
                topHotels.map((hotel: any) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium text-[#0F1B2D]">{hotel.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="font-bold text-[10px] uppercase">{hotel.plan || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <MoneyDisplay amount={hotel.monthlyRevenue ?? 0} className="font-medium" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <StatusBadge status={hotel.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Tier Dialog */}
      <Dialog open={addTierOpen} onOpenChange={setAddTierOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Add New Tier</DialogTitle>
            <DialogDescription>Create a new subscription tier.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tier-plan">Plan</Label>
              <select
                id="tier-plan"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newTier.plan}
                onChange={(e) => setNewTier({ ...newTier, plan: e.target.value })}
              >
                <option value="BASIC">Basic</option>
                <option value="PROFESSIONAL">Professional</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier-price">Price (per month)</Label>
              <Input
                id="tier-price"
                type="number"
                min="0"
                step="0.01"
                value={newTier.price}
                onChange={(e) => setNewTier({ ...newTier, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier-features">Features (comma-separated)</Label>
              <Input
                id="tier-features"
                value={newTier.features}
                onChange={(e) => setNewTier({ ...newTier, features: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => { setAddTierOpen(false); setNewTier({ plan: 'BASIC', price: 0, features: '' }); }}>
              Cancel
            </Button>
            <Button
              className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
              onClick={handleAddTier}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Create Tier'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Edit Plan</DialogTitle>
            <DialogDescription>Update the subscription plan details.</DialogDescription>
          </DialogHeader>

          {editingPlan && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  value={editingPlan.name}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-price">Price (per month)</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingPlan.price}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-features">Features (comma-separated)</Label>
                <Input
                  id="plan-features"
                  value={editingPlan.features}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, features: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Save Changes'
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-600">
              Delete Plan
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to permanently delete{' '}
              <span className="font-bold text-[#0F1B2D]">
                "{deleteTarget?.name}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Confirm Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

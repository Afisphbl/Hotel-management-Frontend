import {
  usePlatformHotels,
  useUpdatePlatformHotel,
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
  Filter,
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
  ChevronRight,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { useNavigate, Link } from "@tanstack/react-router";
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
import { useState } from "react";
import { toast } from "sonner";

export function PlatformHotels() {
  const {
    data: hotels,
    isLoading,
    isError,
    error,
    refetch,
  } = usePlatformHotels();
  const updateMutation = useUpdatePlatformHotel();
  const navigate = useNavigate();

  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (hotel: any) => {
    setEditingHotel({ ...hotel });
    setIsEditDialogOpen(true);
  };

  const handleStatusChange = async (hotel: any, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({
        id: hotel.id,
        data: { ...hotel, status: newStatus },
      });
      toast.success(
        `Hotel ${newStatus === "active" ? "reactivated" : "suspended"} successfully`,
      );
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdate = async () => {
    if (!editingHotel) return;

    try {
      await updateMutation.mutateAsync({
        id: editingHotel.id,
        data: editingHotel,
      });
      toast.success("Hotel updated successfully");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update hotel");
    }
  };

  const filteredHotels = hotels?.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
              <Button
                variant='outline'
                size='sm'
                className='hidden sm:flex gap-2 border-slate-200'
              >
                <Filter className='w-4 h-4' /> Filters
              </Button>
              <Select defaultValue='all'>
                <SelectTrigger className='flex-1 md:w-[140px] h-9 bg-[#F8F7F4] border-none'>
                  <SelectValue placeholder='All Plans' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Plans</SelectItem>
                  <SelectItem value='Enterprise'>Enterprise</SelectItem>
                  <SelectItem value='Pro'>Pro</SelectItem>
                  <SelectItem value='Basic'>Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0 overflow-hidden'>
          <Table>
            <TableHeader className='bg-[#F8F7F4]'>
              <TableRow>
                <TableHead className='w-[300px]'>Property</TableHead>
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
              ) : !filteredHotels || filteredHotels.length === 0 ? (
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
                filteredHotels.map((hotel) => (
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
                          {hotel.owner}
                        </p>
                        <p className='text-[10px] text-muted-foreground'>
                          {hotel.email}
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
                      {hotel.rooms || 120}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={hotel.status} />
                    </TableCell>
                    <TableCell className='hidden xl:table-cell text-[11px] text-muted-foreground font-medium'>
                      {format(new Date(hotel.created), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell
                      className='text-right'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className='flex items-center justify-end'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground hover:text-[#C9973A]'
                          onClick={() =>
                            navigate({ to: `/platform/hotels/${hotel.id}` })
                          }
                        >
                          <ChevronRight className='w-4 h-4' />
                        </Button>
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
                              onClick={() =>
                                toast.info(
                                  "Impersonating hotel... session starting",
                                )
                              }
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
                              onClick={() =>
                                toast.error(
                                  "Delete action requires multi-stage verification",
                                )
                              }
                            >
                              <Trash2 className='w-4 h-4' /> Mark for Archive
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

      <div className='flex items-center justify-between text-xs text-muted-foreground mt-4 px-2'>
        <p>
          Showing {filteredHotels?.length} of {hotels?.length} properties
        </p>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled
            className='h-8 border-slate-200'
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            disabled
            className='h-8 border-slate-200'
          >
            Next
          </Button>
        </div>
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
                  id='owner'
                  value={editingHotel.owner}
                  onChange={(e) =>
                    setEditingHotel({ ...editingHotel, owner: e.target.value })
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
                      <SelectItem value='Basic'>Basic</SelectItem>
                      <SelectItem value='Pro'>Pro</SelectItem>
                      <SelectItem value='Enterprise'>Enterprise</SelectItem>
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
    </div>
  );
}

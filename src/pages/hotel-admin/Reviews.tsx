import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Eye, EyeOff, Trash2, Search, MessageSquare, EllipsisVertical, CheckCircle, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function AdminReviews() {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      
      const res = await api.get(`hotel/reviews?${params.toString()}`);
      
      // Filter client-side for search term and rating since the endpoint returns all
      let filtered = res.items || [];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter((r: any) => 
          (r.firstName && r.firstName.toLowerCase().includes(term)) ||
          (r.lastName && r.lastName.toLowerCase().includes(term)) ||
          (r.comment && r.comment.toLowerCase().includes(term)) ||
          (r.roomNumber && String(r.roomNumber).toLowerCase().includes(term))
        );
      }
      if (filterRating !== 'all') {
        filtered = filtered.filter((r: any) => r.rating === filterRating);
      }

      setReviews(filtered);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / PAGE_SIZE));
    } catch (err: any) {
      toast.error('Failed to load reviews: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  // Refetch when search/filter changes
  useEffect(() => {
    setPage(1);
    fetchReviews();
  }, [searchTerm, filterRating]);

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      await api.patch(`hotel/reviews/${id}/visibility`, { isVisible: !currentVisible });
      toast.success(`Review is now ${!currentVisible ? 'visible' : 'hidden'}`);
      fetchReviews();
    } catch (err: any) {
      toast.error('Failed to update visibility: ' + err.message);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`hotel/reviews/${id}/status`, { status });
      toast.success(`Review marked as ${status}`);
      fetchReviews();
    } catch (err: any) {
      toast.error('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`hotel/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err: any) {
      toast.error('Failed to delete review: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-amber-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Guest Reviews</h1>
          <p className="text-sm text-muted-foreground">Manage and moderate room reviews left by booking website guests</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by guest, room, comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all text-sm rounded-lg"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-sm font-medium text-gray-500 self-center mr-2 shrink-0">Filter:</span>
          <Button
            variant={filterRating === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterRating('all')}
            className={`rounded-full text-xs font-medium ${filterRating === 'all' ? 'bg-[#0F1B2D] text-white hover:bg-[#1a2a3a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            All Ratings
          </Button>
          {[5, 4, 3, 2, 1].map((r) => (
            <Button
              key={r}
              variant={filterRating === r ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRating(r)}
              className={`rounded-full text-xs font-medium shrink-0 flex items-center gap-1 ${filterRating === r ? 'bg-[#0F1B2D] text-white hover:bg-[#1a2a3a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {r} <Star className="w-3.5 h-3.5 fill-current" />
            </Button>
          ))}
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-100">
                <TableRow>
                  <TableHead className="py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider pl-6">Guest</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Room</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Rating</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider w-1/3">Comment</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Visibility</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-40 text-center text-sm text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1B2D]"></div>
                        <span>Loading reviews...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-40 text-center text-sm text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-400">No reviews found matching the search criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((r) => (
                    <TableRow key={r.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                      <TableCell className="py-4 font-medium text-gray-900 pl-6">
                        {r.firstName} {r.lastName}
                      </TableCell>
                      <TableCell className="py-4 text-gray-700">
                        {r.roomNumber ? `Room ${r.roomNumber}` : <span className="text-gray-400 italic">Unknown Room</span>}
                      </TableCell>
                      <TableCell className="py-4">
                        {renderStars(r.rating)}
                      </TableCell>
                      <TableCell className="py-4 text-gray-600 max-w-xs truncate text-sm">
                        <span title={r.comment}>{r.comment}</span>
                      </TableCell>
                      <TableCell className="py-4 text-gray-500 text-sm">
                        {format(new Date(r.createdAt), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${r.status === 'seen' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                          {r.status === 'seen' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {r.status === 'seen' ? 'Seen' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${r.isVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {r.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-500">
                              <EllipsisVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => handleUpdateStatus(r.id, r.status === 'seen' ? 'pending' : 'seen')}>
                              {r.status === 'seen' ? <Clock className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                              {r.status === 'seen' ? 'Mark Pending' : 'Mark Seen'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleVisibility(r.id, r.isVisible)}>
                              {r.isVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                              {r.isVisible ? 'Hide' : 'Show'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingId(r.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialog open={deletingId === r.id} onOpenChange={(open) => { if (!open) setDeletingId(null); }}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the review from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(r.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500 font-medium">
                Showing page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-xs font-semibold border-gray-200"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="text-xs font-semibold border-gray-200"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

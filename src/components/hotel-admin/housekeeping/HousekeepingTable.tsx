import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, CheckCircle, Edit2, Trash, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HousekeepingTableProps {
  tasks: any[];
  isLoading: boolean;
  searchTerm: string;
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (task: any) => void;
  onAssign: (task: any) => void;
  onComplete: (task: any) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority?: string) => string;
  PAGE_SIZE: number;
}

export function HousekeepingTable({
  tasks, isLoading, searchTerm, page, total, totalPages,
  onPageChange, onEdit, onAssign, onComplete, onDelete, getPriorityColor, PAGE_SIZE
}: HousekeepingTableProps) {
  const filtered = tasks.filter(t =>
    t.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader><CardTitle className="text-lg">Housekeeping Tasks</CardTitle></CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">Room {t.room || t.roomNumber || '—'}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate" title={t.description}>{t.description || '—'}</TableCell>
                    <TableCell className="text-sm">{t.assignedToName || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        t.priority === 'HIGH' || t.priority === 'URGENT' ? 'border-red-200 text-red-700 bg-red-50' :
                          t.priority === 'NORMAL' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            'border-gray-200 text-gray-600'
                      )}>{t.priority || 'NORMAL'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs',
                        t.status === 'COMPLETED' || t.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                          t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}>
                        {t.status?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {t.status !== 'COMPLETED' && t.status !== 'VERIFIED' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => onAssign(t)} title="Assign Staff">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onEdit(t)} title="Edit Task">
                              <Edit2 className="w-4 h-4 text-amber-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onComplete(t)} title="Mark Complete">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => onDelete(t.id)} title="Delete Task">
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No tasks found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}</p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button key={p} variant={p === page ? "default" : "outline"} size="sm"
                      className={p === page ? "bg-[#0F1B2D]" : ""} onClick={() => onPageChange(p)}>{p}</Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

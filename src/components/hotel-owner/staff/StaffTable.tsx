import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Shield, XCircle, CheckCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './StatusBadge';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleName?: string;
  status: string;
  grantedAt?: string;
}

interface StaffTableProps {
  isLoading: boolean;
  staffList: StaffMember[];
  searchTerm?: string;
  page: number;
  pageSize?: number;
  totalPages: number;
  total: number;
  canManageRole: (item: StaffMember) => boolean;
  onChangeRole: (item: StaffMember) => void;
  onToggleStatus: (item: StaffMember) => void;
  onRemove: (item: StaffMember) => void;
  onPageChange: (page: number) => void;
}

function statusLabel(s: string) {
  const map: Record<string, string> = { ACTIVE: 'Active', INACTIVE: 'Inactive', PENDING: 'Pending' };
  return map[s] || s;
}

function filterStaff(list: StaffMember[], term: string): StaffMember[] {
  if (!term) return list;
  const q = term.toLowerCase();
  return list.filter(m =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
    m.email?.toLowerCase().includes(q)
  );
}

export function StaffTable({
  isLoading,
  staffList,
  searchTerm = '',
  page,
  pageSize = 10,
  totalPages,
  total,
  canManageRole,
  onChangeRole,
  onToggleStatus,
  onRemove,
  onPageChange,
}: StaffTableProps) {
  const displayList = filterStaff(staffList, searchTerm);

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Access &amp; Roles</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Granted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayList.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-sm font-bold">
                          {item.firstName?.[0]}{item.lastName?.[0]}
                        </div>
                        <span>{item.firstName} {item.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm"><Mail className="w-3 h-3 text-muted-foreground" /> {item.email}</span>
                    </TableCell>
                    <TableCell>
                      {item.roleName ? (
                        <Badge variant="secondary" className="font-normal">
                          {item.roleName.replace(/_/g, ' ')}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No role</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} label={statusLabel(item.status)} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.grantedAt ? new Date(item.grantedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {canManageRole(item) && (
                          <Button variant="ghost" size="sm" onClick={() => onChangeRole(item)} title="Change role">
                            <Shield className="w-4 h-4" />
                          </Button>
                        )}
                        {canManageRole(item) && (
                          <Button variant="ghost" size="sm" onClick={() => onToggleStatus(item)} title={item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                            {item.status === 'ACTIVE' ? <XCircle className="w-4 h-4 text-orange-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                          </Button>
                        )}
                        {canManageRole(item) && (
                          <Button variant="ghost" size="sm" onClick={() => onRemove(item)} title="Revoke access">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {displayList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No staff access records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button key={p} variant={p === page ? "default" : "outline"} size="sm" className={p === page ? "bg-[#0F1B2D]" : ""} onClick={() => onPageChange(p)}>
                      {p}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
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

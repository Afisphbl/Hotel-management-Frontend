import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StaffRow } from './StaffRow';
import { StaffPagination } from './StaffPagination';

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
  searchTerm: string;
  canManageRole: (item: StaffMember) => boolean;
  isOwner: (item: StaffMember) => boolean;
  onRoleChange: (id: string, currentRoleId: string) => void;
  onToggleStatus: (item: StaffMember) => void;
  onRemove: (item: StaffMember) => void;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function StaffTable({
  isLoading,
  staffList,
  searchTerm,
  canManageRole,
  isOwner,
  onRoleChange,
  onToggleStatus,
  onRemove,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: StaffTableProps) {
  const filteredList = staffList.filter(m =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader><CardTitle className="text-lg">Staff Directory</CardTitle></CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
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
                {filteredList.map(item => (
                  <StaffRow
                    key={item.id}
                    item={item}
                    canManage={canManageRole(item)}
                    isOwner={isOwner(item)}
                    onRoleChange={onRoleChange}
                    onToggleStatus={onToggleStatus}
                    onRemove={onRemove}
                  />
                ))}
                {filteredList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No staff found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <StaffPagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

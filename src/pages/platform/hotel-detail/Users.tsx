
import { useParams } from '@tanstack/react-router';
import { useHotelUsers } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MoreVertical, Database } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

export function HotelUsers() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: users, isLoading, isError, error, refetch } = useHotelUsers(id);

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="font-serif text-lg sm:text-xl text-center sm:text-left">Hotel Staff</CardTitle>
          <CardDescription className="text-center sm:text-left text-xs sm:text-sm">Manage user accounts and permissions.</CardDescription>
        </div>
        <Button size="sm" className="w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Database className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-sm text-slate-500">{error?.message || 'Failed to load users'}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>Retry</Button>
          </div>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))
        ) : users && users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="font-bold text-xs sm:text-sm text-[#0F1B2D] truncate max-w-[120px] sm:max-w-none">{user.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="font-bold text-[10px] uppercase">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, HH:mm') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Database className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">No users found</p>
            <p className="text-[10px] text-slate-300 mt-1">This section has no database or data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

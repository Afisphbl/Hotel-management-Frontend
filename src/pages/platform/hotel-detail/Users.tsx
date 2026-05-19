
import { useParams } from '@tanstack/react-router';
import { useHotelUsers } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

export function HotelUsers() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: users } = useHotelUsers(id);

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
            {users?.map(user => (
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
                  {format(new Date(user.lastLogin), 'MMM d, HH:mm')}
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
      </CardContent>
    </Card>
  );
}

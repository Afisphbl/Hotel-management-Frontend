import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, XCircle, CheckCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface StaffRowProps {
  item: StaffMember;
  canManage: boolean;
  isOwner: boolean;
  onRoleChange: (id: string, currentRoleId: string) => void;
  onToggleStatus: (item: StaffMember) => void;
  onRemove: (item: StaffMember) => void;
}

const statusLabel = (s: string) => ({ ACTIVE: 'Active', INACTIVE: 'Inactive', PENDING: 'Pending' }[s] || s);

export function StaffRow({ item, canManage, isOwner, onRoleChange, onToggleStatus, onRemove }: StaffRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-sm font-bold">
            {item.firstName?.[0]}{item.lastName?.[0]}
          </div>
          <span>{item.firstName} {item.lastName}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm">{item.email}</TableCell>
      <TableCell>
        {item.roleName ? (
          <Badge variant="secondary" className="font-normal">{item.roleName.replace(/_/g, ' ')}</Badge>
        ) : <span className="text-muted-foreground text-sm">No role</span>}
      </TableCell>
      <TableCell>
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium",
          item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            item.status === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800')}>
          {statusLabel(item.status)}
        </span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {item.grantedAt ? new Date(item.grantedAt).toLocaleDateString() : '-'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          {canManage && (
            <Button variant="ghost" size="sm" onClick={() => onRoleChange(item.id, item.roleId)} title="Change role">
              <Shield className="w-4 h-4" />
            </Button>
          )}
          {!isOwner && canManage && (
            <Button variant="ghost" size="sm" onClick={() => onToggleStatus(item)} title={item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
              {item.status === 'ACTIVE' ? <XCircle className="w-4 h-4 text-orange-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
            </Button>
          )}
          {!isOwner && canManage && (
            <Button variant="ghost" size="sm" onClick={() => onRemove(item)} title="Revoke access">
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

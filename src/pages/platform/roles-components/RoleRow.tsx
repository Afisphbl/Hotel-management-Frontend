import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MoreVertical } from "lucide-react";

interface RoleRowProps {
  role: any;
}

export function RoleRow({ role }: RoleRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className='flex items-center gap-3'>
          <div className='hidden xs:flex w-8 h-8 rounded-full bg-[#0F1B2D] flex items-center justify-center text-white text-[10px] font-bold'>
            {role.name.charAt(0)}
          </div>
          <span className='font-bold text-xs sm:text-sm text-[#0F1B2D] text-nowrap'>
            {role.name}
          </span>
        </div>
      </TableCell>
      <TableCell className='hidden sm:table-cell'>
        <div className='flex items-center gap-2'>
          <Users className='w-3.5 h-3.5 text-muted-foreground' />
          <span className='text-sm font-medium'>{role.users}</span>
        </div>
      </TableCell>
      <TableCell className='hidden md:table-cell'>
        <div className='flex flex-wrap gap-1.5'>
          {role.permissions.slice(0, 2).map((perm: string, i: number) => (
            <Badge
              key={i}
              variant='outline'
              className='text-[9px] uppercase border-[#C9973A]/30 text-[#C9973A] bg-[#C9973A]/5'
            >
              {perm}
            </Badge>
          ))}
          {role.permissions.length > 2 && (
            <span className='text-[10px] text-muted-foreground ml-1'>
              +{role.permissions.length - 2}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className='text-right'>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <MoreVertical className='w-4 h-4' />
        </Button>
      </TableCell>
    </TableRow>
  );
}

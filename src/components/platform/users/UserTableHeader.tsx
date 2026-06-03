import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserTableHeaderProps {
  children: React.ReactNode;
}

export function UserTableHeader({ children }: UserTableHeaderProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
          <TableHead className="font-bold uppercase tracking-widest text-[10px]">
            User
          </TableHead>
          <TableHead className="font-bold uppercase tracking-widest text-[10px]">
            Role
          </TableHead>
          <TableHead className="font-bold uppercase tracking-widest text-[10px]">
            Status
          </TableHead>
          <TableHead className="font-bold uppercase tracking-widest text-[10px]">
            Last Activity
          </TableHead>
          <TableHead className="font-bold uppercase tracking-widest text-[10px] hidden lg:table-cell">
            Invited By
          </TableHead>
          <TableHead className="font-bold uppercase tracking-widest text-[10px] hidden lg:table-cell">
            2FA
          </TableHead>
          <TableHead className="text-right font-bold uppercase tracking-widest text-[10px]">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {children}
      </TableBody>
    </Table>
  );
}
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Settings } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  status: string;
  currency: string;
  timezone: string;
  branding?: { logoUrl?: string };
}

interface HotelsTableProps {
  hotels: Hotel[];
  isLoading: boolean;
  onToggleActive: (id: string, active: boolean) => void;
  onManage: (hotel: Hotel) => void;
}

export function HotelsTable({ hotels, isLoading, onToggleActive, onManage }: HotelsTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Hotel Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Branding</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hotels.map((h) => (
          <TableRow key={h.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center overflow-hidden border">
                  {h.branding?.logoUrl ? <img src={h.branding.logoUrl} alt={`${h.name} logo`} className="w-full h-full object-cover" /> : <Building2 className="w-4 h-4 text-slate-400" />}
                </div>
                {h.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" /> {h.location}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-normal">
                {h.currency} • {h.timezone}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch checked={h.status === 'ACTIVE'} onCheckedChange={(val) => onToggleActive(h.id, val)} />
                <span className="text-xs font-medium">{h.status}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onManage(h)}>
                <Settings className="w-4 h-4 mr-2" /> Manage
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {hotels.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
              No hotels found. Create your first hotel to get started.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

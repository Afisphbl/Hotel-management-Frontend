import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical } from "lucide-react";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface TopPropertiesTableProps {
  hotels: any[];
  isLoading: boolean;
}

export function TopPropertiesTable({ hotels, isLoading }: TopPropertiesTableProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Top Subscribing Properties</CardTitle>
        <CardDescription>A list of hotels by their revenue contribution.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead className="hidden sm:table-cell">Plan</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-14" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : hotels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No active properties found.
                </TableCell>
              </TableRow>
            ) : (
              hotels.map((hotel: any) => (
                <TableRow key={hotel.id}>
                  <TableCell className="font-medium text-[#0F1B2D]">{hotel.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="font-bold text-[10px] uppercase">
                      {hotel.plan || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <MoneyDisplay amount={hotel.monthlyRevenue ?? 0} className="font-medium" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <StatusBadge status={hotel.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Edit2, CheckCircle, Trash, UserCheck } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { MaintenanceTicket } from "./types";

interface MaintenanceTicketsTableProps {
  tickets: MaintenanceTicket[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAssign: (ticket: MaintenanceTicket) => void;
  onEdit: (ticket: MaintenanceTicket) => void;
  onResolve: (ticket: MaintenanceTicket) => void;
  onDelete: (id: string) => void;
}

export function MaintenanceTicketsTable({
  tickets,
  isLoading,
  total,
  page,
  totalPages,
  onPageChange,
  onAssign,
  onEdit,
  onResolve,
  onDelete,
}: MaintenanceTicketsTableProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Maintenance Tickets</CardTitle>
      </CardHeader>
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
                  <TableHead>Room</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">
                      Room {ticket.room?.roomNumber || ticket.roomId || "—"}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {ticket.title || ticket.description || "—"}
                    </TableCell>
                    <TableCell className="text-sm">{ticket.assignedToName || "—"}</TableCell>
                    <TableCell className="text-sm">
                      {ticket.reporter
                        ? `${ticket.reporter.firstName} ${ticket.reporter.lastName}`
                        : ticket.reportedBy || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          ticket.priority === "high" || ticket.priority === "critical"
                            ? "border-red-200 text-red-700 bg-red-50"
                            : ticket.priority === "medium"
                              ? "border-blue-200 text-blue-700 bg-blue-50"
                              : "border-gray-200 text-gray-600",
                        )}
                      >
                        {(ticket.priority || "medium").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          ticket.status === "resolved" || ticket.status === "closed"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "in_progress" || ticket.status === "assigned"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800",
                        )}
                      >
                        {(ticket.status || "reported").replace(/_/g, " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {ticket.cost != null ? formatCurrency(ticket.cost) : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ticket.createdAt ? formatDate(ticket.createdAt) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {ticket.status !== "resolved" && ticket.status !== "closed" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => onAssign(ticket)} title="Assign Staff">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onEdit(ticket)} title="Edit Ticket">
                              <Edit2 className="w-4 h-4 text-amber-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onResolve(ticket)} title="Resolve">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => onDelete(ticket.id)} title="Delete Ticket">
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                      No tickets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * 15 + 1}-{Math.min(page * 15, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      className={p === page ? "bg-[#0F1B2D]" : ""}
                      onClick={() => onPageChange(p)}
                    >
                      {p}
                    </Button>
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

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Wrench, 
  Plus,
  Search,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MaintenancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/hotel/maintenance?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setTickets(data.data || []);
    } catch (error) {
      console.error('Failed to fetch maintenance tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.issue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = [
    { value: 'ALL', label: 'All Tickets' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const completedCount = tickets.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Maintenance</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track and manage maintenance requests</p>
        </div>
        <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Tickets</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{tickets.length}</h3>
              </div>
              <Wrench className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Open Issues</p>
                <h3 className="text-2xl font-bold text-red-600 mt-1">{openCount}</h3>
              </div>
              <AlertCircle className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Completed</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">{completedCount}</h3>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by room or issue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {statuses.map(status => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    selectedStatus === status.value
                      ? "bg-[#C9973A] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Maintenance Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Ticket #</th>
                    <th className="text-left py-3 px-4 font-semibold">Room</th>
                    <th className="text-left py-3 px-4 font-semibold">Issue</th>
                    <th className="text-left py-3 px-4 font-semibold">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-mono text-[#0F1B2D]">#{ticket.ticketNumber}</td>
                      <td className="py-3 px-4 font-medium text-[#0F1B2D]">{ticket.room}</td>
                      <td className="py-3 px-4">{ticket.issue}</td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="py-3 px-4">
                        <MaintenanceStatusBadge status={ticket.status} />
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{ticket.createdDate}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No maintenance tickets</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MaintenanceStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    'OPEN': { bg: 'bg-red-100', text: 'text-red-800' },
    'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'COMPLETED': { bg: 'bg-green-100', text: 'text-green-800' }
  };

  const config = statusConfig[status] || statusConfig['OPEN'];

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', config.bg, config.text)}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const priorityConfig: Record<string, { bg: string; text: string }> = {
    'LOW': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'MEDIUM': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'HIGH': { bg: 'bg-red-100', text: 'text-red-800' },
    'URGENT': { bg: 'bg-red-200', text: 'text-red-900' }
  };

  const config = priorityConfig[priority] || priorityConfig['LOW'];

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', config.bg, config.text)}>
      {priority}
    </span>
  );
}

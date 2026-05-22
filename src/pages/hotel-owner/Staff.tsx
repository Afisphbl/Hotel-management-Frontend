import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function StaffPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchStaff();
  }, [selectedStatus]);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/hotel/staff?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStaffMembers(data.data || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStaff = staffMembers.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = [
    { value: 'ALL', label: 'All Staff' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'ON_LEAVE', label: 'On Leave' }
  ];

  const activeCount = staffMembers.filter(s => s.status === 'ACTIVE').length;
  const roles = ['Manager', 'Receptionist', 'Housekeeper', 'Maintenance', 'Chef'];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Staff</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your hotel staff and team members</p>
        </div>
        <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Staff</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{staffMembers.length}</h3>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Active</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">{activeCount}</h3>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">On Leave</p>
                <h3 className="text-2xl font-bold text-orange-600 mt-1">
                  {staffMembers.filter(s => s.status === 'ON_LEAVE').length}
                </h3>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-20" />
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
                  placeholder="Search by name or email..."
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

      {/* Staff List */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : filteredStaff.length > 0 ? (
            <div className="space-y-4">
              {filteredStaff.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#0F1B2D]">{member.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize mt-1">{member.role} • {member.department}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {member.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {member.email}
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {member.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StaffStatusBadge status={member.status} />
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No staff members found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StaffStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    'ACTIVE': { bg: 'bg-green-100', text: 'text-green-800' },
    'INACTIVE': { bg: 'bg-gray-100', text: 'text-gray-800' },
    'ON_LEAVE': { bg: 'bg-orange-100', text: 'text-orange-800' }
  };

  const config = statusConfig[status] || statusConfig['ACTIVE'];

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', config.bg, config.text)}>
      {status}
    </span>
  );
}

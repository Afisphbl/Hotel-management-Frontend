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
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export function GuestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [guests, setGuests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/hotel/guests?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setGuests(data.data || []);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Guests</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage guest profiles and information</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Guests</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{guests.length}</h3>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Active Stays</p>
                <h3 className="text-2xl font-bold text-blue-600 mt-1">
                  {guests.filter(g => g.currentlyStaying).length}
                </h3>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">VIP Guests</p>
                <h3 className="text-2xl font-bold text-purple-600 mt-1">
                  {guests.filter(g => g.vip).length}
                </h3>
              </div>
              <Users className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchGuests()}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Guests List */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Guest Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : guests.length > 0 ? (
              guests.map(guest => (
                <div key={guest.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#C9973A] transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9973A] to-[#0F1B2D] flex items-center justify-center text-white font-bold">
                        {guest.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0F1B2D]">{guest.name}</h4>
                        <p className="text-sm text-muted-foreground">{guest.country}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 mt-3 ml-15 text-xs text-muted-foreground">
                      {guest.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {guest.email}
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {guest.phone}
                        </div>
                      )}
                      {guest.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {guest.address}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {guest.vip && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                        VIP Guest
                      </span>
                    )}
                    {guest.currentlyStaying && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        Currently Staying
                      </span>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-muted-foreground">No guests found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

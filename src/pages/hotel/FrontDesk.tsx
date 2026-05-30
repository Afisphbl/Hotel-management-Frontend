import React from 'react';
import { useHotelBookings, useHotelRooms } from '@/hooks/useHotelData';
import { cn, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  UserPlus, 
  LogIn, 
  LogOut, 
  Plus, 
  Search,
  Calendar,
  MoreVertical,
  DoorOpen,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function HotelFrontDesk() {
  const { data: bookings } = useHotelBookings();
  const { data: rooms } = useHotelRooms();

  const arrivals = bookings?.filter(b => b.status === 'confirmed') || [];
  const departures = bookings?.filter(b => b.status === 'checked_in') || [];
  const inHouse = bookings?.filter(b => b.status === 'checked_in') || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Front Desk</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage guest arrivals, departures, and room allocations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none bg-white border-none shadow-sm gap-2">
            <Search className="w-4 h-4" /> Search
          </Button>
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> Walk-in
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Expected Arrivals', value: arrivals.length, icon: LogIn, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Expected Departures', value: departures.length, icon: LogOut, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'In-House Guests', value: inHouse.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Available Rooms', value: rooms?.filter(r => r.status === 'available').length || 0, icon: DoorOpen, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm border-none bg-white p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-serif text-[#0F1B2D]">{stat.value}</p>
              </div>
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="arrivals" className="flex flex-col gap-6 w-full">
        <Card className="shadow-sm border-none bg-slate-50 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9973A]">Guest Manager</p>
              <h3 className="font-serif text-lg text-[#0F1B2D]">Quick Select</h3>
            </div>
            
            <TabsList className="bg-white/50 p-1 h-auto w-full border-none shadow-none flex-col gap-2">
              <TabsTrigger value="arrivals" className="text-xs h-10 w-full justify-start px-4 data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white transition-all">
                <LogIn className="w-3.5 h-3.5 mr-2" /> Arrivals Today ({arrivals.length})
              </TabsTrigger>
              <TabsTrigger value="departures" className="text-xs h-10 w-full justify-start px-4 data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white transition-all">
                <LogOut className="w-3.5 h-3.5 mr-2" /> Departures Today ({departures.length})
              </TabsTrigger>
              <TabsTrigger value="in-house" className="text-xs h-10 w-full justify-start px-4 data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white transition-all">
                <Users className="w-3.5 h-3.5 mr-2" /> Current In-House
              </TabsTrigger>
            </TabsList>

            <div className="pt-4 border-t border-slate-200">
               <div className="flex flex-col gap-3">
                 <p className="text-[10px] font-bold uppercase text-muted-foreground">Today's Status:</p>
                 <div className="flex flex-col gap-2">
                   <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500" />
                       <span className="text-xs font-medium">Pending Arrivals</span>
                     </div>
                     <span className="text-xs font-bold">{arrivals.length}</span>
                   </div>
                   <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-amber-500" />
                       <span className="text-xs font-medium">Expected Departures</span>
                     </div>
                     <span className="text-xs font-bold">{departures.length}</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-white p-4">
          <TabsContent value="arrivals" className="m-0 focus-visible:outline-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-[#0F1B2D]">Expected Arrivals</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{arrivals.length}</Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {arrivals.map(booking => (
                  <div key={booking.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:shadow-md transition-all group">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-[#0F1B2D] text-base">{booking.guest}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">#{booking.id}</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase py-0 px-2 h-5 bg-white">Standard</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 border-dashed">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                          <p className="text-sm font-medium mt-0.5">{booking.nights} Nights</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-xs font-medium text-green-700">Room Ready</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-[#C9973A] hover:bg-[#b08432] text-white font-bold h-9 text-xs">Check In</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-9 w-9 bg-white border border-slate-200 rounded-md flex items-center justify-center hover:bg-accent">
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem><CheckCircle className="w-3.5 h-3.5 mr-2 text-green-600" /> Confirm</DropdownMenuItem>
                            <DropdownMenuItem><LogIn className="w-3.5 h-3.5 mr-2 text-blue-600" /> Check In</DropdownMenuItem>
                            <DropdownMenuItem><LogOut className="w-3.5 h-3.5 mr-2 text-orange-600" /> Check Out</DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-600"><XCircle className="w-3.5 h-3.5 mr-2" /> No Show</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600"><XCircle className="w-3.5 h-3.5 mr-2" /> Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
                {arrivals.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">No arrivals today</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="departures" className="m-0 focus-visible:outline-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-[#0F1B2D]">Expected Departures</h3>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{departures.length}</Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {departures.map(booking => (
                  <div key={booking.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:shadow-md transition-all group">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-[#0F1B2D] text-base">{booking.guest}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">#{booking.id}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 text-[10px] uppercase border-none">Paid</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 border-dashed">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Room</p>
                          <p className="text-sm font-medium mt-0.5">Room 20{booking.id.slice(-1)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Charges</p>
                          <p className="text-sm font-bold text-[#0F1B2D] mt-0.5">£{(Math.random() * 500 + 100).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a] text-white font-bold h-9 text-xs">Check Out</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-9 w-9 bg-white border border-slate-200 rounded-md flex items-center justify-center hover:bg-accent">
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem><CheckCircle className="w-3.5 h-3.5 mr-2 text-green-600" /> Confirm</DropdownMenuItem>
                            <DropdownMenuItem><LogIn className="w-3.5 h-3.5 mr-2 text-blue-600" /> Check In</DropdownMenuItem>
                            <DropdownMenuItem><LogOut className="w-3.5 h-3.5 mr-2" /> Check Out</DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-600"><XCircle className="w-3.5 h-3.5 mr-2" /> No Show</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600"><XCircle className="w-3.5 h-3.5 mr-2" /> Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
                {departures.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">No departures expected today</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="in-house" className="m-0 focus-visible:outline-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-[#0F1B2D]">Current In-House</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{inHouse.length}</Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {inHouse.map(booking => (
                  <div key={booking.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:shadow-md transition-all group">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-[#0F1B2D] text-base">{booking.guest}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">#{booking.id}</p>
                        </div>
                        <p className="text-sm font-medium text-slate-700">Room {100 + Math.floor(Math.random() * 20)}</p>
                      </div>

                      <div className="py-3 border-y border-slate-100 border-dashed">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Account status</p>
                        <div className="mt-2">
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C9973A]" style={{ width: '65%' }} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 mt-1.5 inline-flex items-center gap-1">
                            £420.50 <span className="opacity-60">Pending</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                        <span className="text-xs text-slate-500">{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-md">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem><CheckCircle className="w-3.5 h-3.5 mr-2 text-green-600" /> Confirm</DropdownMenuItem>
                            <DropdownMenuItem><LogIn className="w-3.5 h-3.5 mr-2 text-blue-600" /> Check In</DropdownMenuItem>
                            <DropdownMenuItem><LogOut className="w-3.5 h-3.5 mr-2 text-orange-600" /> Check Out</DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-600"><XCircle className="w-3.5 h-3.5 mr-2" /> No Show</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600"><XCircle className="w-3.5 h-3.5 mr-2" /> Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}

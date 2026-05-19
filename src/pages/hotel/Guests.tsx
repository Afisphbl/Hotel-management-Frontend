import React from 'react';
import { useHotelGuests } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone,
  Star,
  History,
  TrendingUp
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { cn } from '@/lib/utils';

export function HotelGuests() {
  const { data: guests } = useHotelGuests();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Guest Directory</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage guest relationships and loyalty.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-white border-none shadow-sm gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> New Guest
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none bg-white p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Returning Guests</p>
              <p className="text-3xl font-serif text-[#0F1B2D]">42%</p>
              <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" /> +5.2% from last month
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>
        
        <Card className="shadow-sm border-none bg-white p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Average Guest Spend</p>
              <p className="text-3xl font-serif text-[#0F1B2D]">£740</p>
              <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold">
                <Star className="w-3 h-3 fill-current" /> High Value Segment
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-white p-6">
           <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Database</p>
              <p className="text-3xl font-serif text-[#0F1B2D]">1,284</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Verified guest profiles</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
              <History className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, email, or phone..." className="pl-9 bg-white border-none shadow-sm" />
        </div>
        <Button variant="outline" className="bg-white border-none shadow-sm gap-2">
          <Filter className="w-4 h-4" /> Advanced Filter
        </Button>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Guest Profile</TableHead>
                <TableHead>Contact Detail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Visits</TableHead>
                <TableHead>Lifetime Spend</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests?.map(guest => (
                <TableRow key={guest.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-serif text-[#0F1B2D] border-2 border-white shadow-sm font-bold">
                        {guest.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#0F1B2D] flex items-center gap-1">
                          {guest.name}
                          {guest.status === 'VIP' && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Last visit: {guest.lastStay}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="w-3 h-3" /> {guest.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="w-3 h-3" /> {guest.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase",
                      guest.status === 'In-house' ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" :
                      guest.status === 'VIP' ? "bg-[#0F1B2D] text-[#C9973A] hover:bg-[#0F1B2D] border-none" :
                      "bg-slate-100 text-slate-600 hover:bg-slate-100 border-none"
                    )}>
                      {guest.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{guest.visits} stays</span>
                  </TableCell>
                  <TableCell>
                    <MoneyDisplay amount={guest.totalSpend} className="font-bold text-[#0F1B2D]" />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

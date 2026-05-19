import React from 'react';
import { useHotelStaff } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  Clock, 
  ShieldCheck, 
  Award, 
  Search, 
  Settings, 
  MoreVertical,
  Mail,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function HotelStaff() {
  const { data: staff } = useHotelStaff();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">HHRR & Team</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage staff and schedules.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-white border-none shadow-sm gap-2">
            <Clock className="w-4 h-4" /> Shifts
          </Button>
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <UserPlus className="w-4 h-4 mr-2" /> Onboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none bg-white p-6">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Team Efficiency</p>
                  <p className="text-3xl font-serif text-[#0F1B2D]">92.4%</p>
                  <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold">
                    <TrendingUp className="w-3 h-3" /> +1.2% this week
                  </div>
               </div>
               <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <Zap className="w-6 h-6" />
               </div>
            </div>
        </Card>

        <Card className="shadow-sm border-none bg-white p-6">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active on Shift</p>
                  <p className="text-3xl font-serif text-[#0F1B2D]">{staff?.filter(s => s.status === 'On Shift').length || 0}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Across 3 departments</p>
               </div>
               <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Users className="w-6 h-6" />
               </div>
            </div>
        </Card>

        <Card className="shadow-sm border-none bg-white p-6">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Next Review</p>
                  <p className="text-lg font-bold text-[#0F1B2D]">Jun 15, 2024</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Performance evaluation due</p>
               </div>
               <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <Award className="w-6 h-6" />
               </div>
            </div>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search team members..." className="pl-9 bg-white border-none shadow-sm" />
        </div>
        <Button variant="outline" className="bg-white border-none shadow-sm gap-2">
            <Settings className="w-4 h-4" /> Role Permissions
        </Button>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Team Member</TableHead>
                <TableHead>Role/Dept</TableHead>
                <TableHead>Shift Profile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff?.map(member => (
                <TableRow key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-[#C9973A] flex items-center justify-center font-bold relative">
                        {member.name.charAt(0)}
                        <div className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                            member.status === 'On Shift' ? "bg-green-500" : "bg-slate-300"
                        )} />
                      </div>
                      <div>
                        <p className="font-bold text-[#0F1B2D]">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Emp ID: {member.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-slate-700">{member.role}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase border-slate-200">
                        {member.shift}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                        "text-[10px] uppercase font-bold tracking-widest",
                        member.status === 'On Shift' ? "text-green-600" : 
                        member.status === 'Active' ? "text-blue-600" : "text-slate-400"
                    )}>
                        {member.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C9973A]" style={{ width: member.efficiency }} />
                        </div>
                        <span className="text-xs font-bold text-[#0F1B2D]">{member.efficiency}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="w-4 h-4 text-slate-400" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                    </div>
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

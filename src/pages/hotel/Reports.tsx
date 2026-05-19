import React from 'react';
import { useHotelCharts } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download, 
  Calendar, 
  Send,
  MoreVertical,
  CheckCircle2,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function HotelReports() {
  const { data: charts } = useHotelCharts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Business Intel</h2>
          <p className="text-sm text-muted-foreground mt-1">Advanced analytics and forecasting.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none bg-white border-none shadow-sm gap-2">
                <Calendar className="w-4 h-4" /> Range
            </Button>
            <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                <Download className="w-4 h-4 mr-2" /> Download
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="font-serif text-xl">RevPAR & Revenue Forecast</CardTitle>
                    <CardDescription>Actual vs Predicted performance for next 30 days.</CardDescription>
                </div>
                <div className="flex gap-1">
                   <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold text-[#C9973A]">Export PDF</Button>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.revenue30d}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#C9973A" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Top Yielding Reports</CardTitle>
            <CardDescription>Quick access to critical data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {[
                { name: 'Manager Daily Flash', date: 'Today, 06:15 AM', size: '2.4 MB' },
                { name: 'Market Segmentation', date: 'Yesterday', size: '1.1 MB' },
                { name: 'Financial Reconciliation', date: 'May 18, 2024', size: '4.8 MB' },
                { name: 'Housekeeping Efficiency', date: 'May 17, 2024', size: '0.9 MB' },
                { name: 'Guest Satisfaction Survey', date: 'Periodic', size: '15.2 MB' },
             ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-[#C9973A] transition-colors group cursor-pointer bg-slate-50/30">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-[#C9973A] transition-colors">
                         <FileText className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-[#0F1B2D]">{report.name}</p>
                         <p className="text-[10px] text-muted-foreground">{report.date} • {report.size}</p>
                      </div>
                   </div>
                   <Download className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             ))}
             <Button variant="ghost" className="w-full text-xs font-bold text-slate-400 mt-2">View Archive Repository</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
            { label: 'Occupancy Rate', value: '82.4%', sub: 'Target: 85%', trend: '+4.2%' },
            { label: 'Avg Room Rate', value: '£184.50', sub: 'YoY +£12.40', trend: '+1.8%' },
            { label: 'Cancellations', value: '4.2%', sub: 'Direct bookings', trend: '-0.5%' },
         ].map((stat, i) => (
            <Card key={i} className="shadow-sm border-none bg-white p-5">
               <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
               </div>
               <p className="text-2xl font-serif text-[#0F1B2D]">{stat.value}</p>
               <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] font-medium text-slate-400">{stat.sub}</p>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{stat.trend}</span>
               </div>
            </Card>
         ))}
      </div>

      <Card className="shadow-sm border-none bg-slate-50 border-2 border-dashed border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-[#0F1B2D]" />
              </div>
              <h3 className="font-serif text-xl text-[#0F1B2D]">Automated Distribution</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-2">Set up scheduled reports to be sent via Email or WhatsApp to your executive team and stakeholders.</p>
              <Button className="mt-6 bg-[#0F1B2D] hover:bg-[#1a2a3a]">Schedule New Task</Button>
          </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { useHotelFinance } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter, 
  Search,
  Wallet,
  Receipt,
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { cn } from '@/lib/utils';

export function HotelFinance() {
  const { data: finance } = useHotelFinance();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Financial Ledger</h2>
          <p className="text-sm text-muted-foreground mt-1">Monitor receivables and payouts.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-white border-none shadow-sm gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            Payout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Net Monthly Revenue', value: finance?.mrr || 0, icon: Wallet, trend: '+12%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Unpaid Invoices', value: finance?.unpaidInvoices || 0, icon: Receipt, trend: '-2', color: 'text-amber-600', bg: 'bg-amber-50', isMoney: false },
          { label: 'Average Daily Rate', value: 165, icon: FileText, trend: '+£12', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'RevPAR', value: 142, icon: CreditCard, trend: '+5.4', color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm border-none bg-white p-5">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                stat.trend.startsWith('+') ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <div className="mt-1">
              {stat.isMoney === false ? (
                <p className="text-2xl font-serif text-[#0F1B2D]">{stat.value}</p>
              ) : (
                <MoneyDisplay amount={stat.value} className="text-2xl font-serif text-[#0F1B2D]" />
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transactions, folio IDs..." className="pl-9 bg-white border-none shadow-sm" />
        </div>
        <Button variant="outline" className="bg-white border-none shadow-sm gap-2">
          <Filter className="w-4 h-4" /> Filter by Type
        </Button>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Recent Transactions</CardTitle>
          <CardDescription>Real-time processing log from all payment gateways.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Transaction Date</TableHead>
                <TableHead>Guest/Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finance?.transactions.map(tx => (
                <TableRow key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-500">{tx.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-[#0F1B2D]">{tx.guest}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                        "text-[9px] font-bold uppercase",
                        tx.type === 'Refund' ? "border-red-200 text-red-600 bg-red-50" : "border-slate-200"
                    )}>
                        {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                        "font-bold",
                        tx.amount < 0 ? "text-red-600" : "text-[#0F1B2D]"
                    )}>
                        <MoneyDisplay amount={tx.amount} />
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                        {tx.status === 'Succeeded' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                            <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-xs font-medium">{tx.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stripe Connect</span>
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

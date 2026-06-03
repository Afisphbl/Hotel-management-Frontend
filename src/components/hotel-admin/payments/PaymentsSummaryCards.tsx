import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Banknote, Clock, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PaymentsSummaryCardsProps {
  summaryData: any[];
  totalRefundedAmount: number;
}

export function PaymentsSummaryCards({ summaryData, totalRefundedAmount }: PaymentsSummaryCardsProps) {
  const grossCollected = summaryData
    .filter((p) => p.status !== "pending" && p.status !== "failed")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalRevenue = (grossCollected || 0) - (totalRefundedAmount || 0);

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Total Collected
              </p>
              <h3 className='text-2xl font-bold text-green-600 mt-1'>
                {formatCurrency(totalRevenue)}
              </h3>
            </div>
            <DollarSign className='w-12 h-12 text-green-600 opacity-20' />
          </div>
        </CardContent>
      </Card>
      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Total Transactions
              </p>
              <h3 className='text-2xl font-bold text-[#0F1B2D] mt-1'>
                {summaryData.length}
              </h3>
            </div>
            <Banknote className='w-12 h-12 text-blue-600 opacity-20' />
          </div>
        </CardContent>
      </Card>
      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Pending
              </p>
              <h3 className='text-2xl font-bold text-yellow-600 mt-1'>
                {summaryData.filter((p) => p.status === "pending").length}
              </h3>
            </div>
            <Clock className='w-12 h-12 text-yellow-600 opacity-20' />
          </div>
        </CardContent>
      </Card>
      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Refunded
              </p>
              <h3 className='text-2xl font-bold text-purple-600 mt-1'>
                {formatCurrency(totalRefundedAmount)}
              </h3>
            </div>
            <RotateCcw className='w-12 h-12 text-purple-600 opacity-20' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

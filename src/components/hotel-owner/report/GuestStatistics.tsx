import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

type Props = { reportData?: any; isLoading?: boolean };

export default function GuestStatistics({ reportData, isLoading }: Props) {
  return (
    <Card className="lg:col-span-2 shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Guest Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
                <h4 className="text-2xl font-bold text-[#0F1B2D] mt-1">
                  {reportData?.guestStatistics.totalGuests || '0'}
                </h4>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                <p className="text-sm font-medium text-muted-foreground">Returning Guests</p>
                <h4 className="text-2xl font-bold text-green-600 mt-1">
                  {reportData?.guestStatistics.returningGuests || '0'}
                </h4>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                <p className="text-sm font-medium text-muted-foreground">New Guests</p>
                <h4 className="text-2xl font-bold text-purple-600 mt-1">
                  {reportData?.guestStatistics.newGuests || '0'}
                </h4>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-sm font-medium text-muted-foreground">Average Stay Duration</p>
              <h4 className="text-2xl font-bold text-amber-600 mt-1">
                {reportData?.guestStatistics.averageStay || '0'} nights
              </h4>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

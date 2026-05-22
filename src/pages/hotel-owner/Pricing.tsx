import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  Plus,
  Trash2,
  Calendar,
  Tag,
  TrendingUp
} from 'lucide-react';

export function PricingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [seasonalRates, setSeasonalRates] = useState<any[]>([]);

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      setIsLoading(true);
      // In real app, fetch from /hotel/pricing endpoints
      const mockData = {
        overrides: [
          { id: '1', roomType: 'Deluxe Suite', baseRate: 150, overrideRate: 180, appliedDates: '2024-05-25 to 2024-05-31' },
          { id: '2', roomType: 'Standard Room', baseRate: 80, overrideRate: 100, appliedDates: '2024-05-28 to 2024-06-04' }
        ],
        promotions: [
          { id: '1', name: 'Early Bird Discount', discount: '15%', validUntil: '2024-12-31', active: true },
          { id: '2', name: 'Group Booking', discount: '20%', validUntil: '2024-12-31', active: true }
        ],
        seasonalRates: [
          { id: '1', season: 'Summer Peak', multiplier: '1.5x', fromDate: '2024-06-01', toDate: '2024-08-31' },
          { id: '2', season: 'Holiday Season', multiplier: '1.8x', fromDate: '2024-12-15', toDate: '2024-12-31' }
        ]
      };
      setOverrides(mockData.overrides);
      setPromotions(mockData.promotions);
      setSeasonalRates(mockData.seasonalRates);
    } catch (error) {
      console.error('Failed to fetch pricing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Pricing Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Configure rates, overrides, and promotions</p>
        </div>
      </div>

      {/* Price Overrides */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Price Overrides</CardTitle>
            <CardDescription>Custom pricing for specific dates</CardDescription>
          </div>
          <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> Add Override
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : overrides.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Room Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Base Rate</th>
                    <th className="text-left py-3 px-4 font-semibold">Override Rate</th>
                    <th className="text-left py-3 px-4 font-semibold">Applied Dates</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overrides.map(override => (
                    <tr key={override.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{override.roomType}</td>
                      <td className="py-3 px-4">${override.baseRate}</td>
                      <td className="py-3 px-4 text-[#C9973A] font-semibold">${override.overrideRate}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{override.appliedDates}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No price overrides</p>
          )}
        </CardContent>
      </Card>

      {/* Promotions */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Promotions</CardTitle>
            <CardDescription>Active discount codes and offers</CardDescription>
          </div>
          <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> Create Promotion
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : promotions.length > 0 ? (
            <div className="space-y-3">
              {promotions.map(promo => (
                <div key={promo.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#C9973A]/10 flex items-center justify-center">
                      <Tag className="w-6 h-6 text-[#C9973A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F1B2D]">{promo.name}</h4>
                      <p className="text-sm text-muted-foreground">Valid until {promo.validUntil}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#C9973A]">{promo.discount}</div>
                      <div className="text-xs text-muted-foreground">{promo.active ? 'Active' : 'Inactive'}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No promotions</p>
          )}
        </CardContent>
      </Card>

      {/* Seasonal Rates */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Seasonal Rates</CardTitle>
            <CardDescription>Rate multipliers for peak seasons</CardDescription>
          </div>
          <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> Add Season
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : seasonalRates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasonalRates.map(season => (
                <div key={season.id} className="p-4 rounded-lg border border-gray-200 hover:border-[#C9973A] transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#0F1B2D]">{season.season}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{season.fromDate} to {season.toDate}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-[#C9973A] font-bold text-lg">
                    <TrendingUp className="w-5 h-5" /> {season.multiplier}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No seasonal rates</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

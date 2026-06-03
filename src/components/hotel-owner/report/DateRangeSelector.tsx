import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  dateRange: string;
  setDateRange: (v: string) => void;
};

const ranges = [
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 90 Days', value: '90' },
  { label: 'Last Year', value: '365' },
  { label: 'Custom', value: 'custom' }
];

export default function DateRangeSelector({ dateRange, setDateRange }: Props) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <div className="flex gap-3">
          {ranges.map(range => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                dateRange === range.value
                  ? 'bg-[#C9973A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlatformSettingsSkeleton() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className='shadow-sm border-none bg-white'>
          <CardHeader>
            <Skeleton className='h-5 w-40' />
            <Skeleton className='h-4 w-52' />
          </CardHeader>
          <CardContent className='space-y-3'>
            <Skeleton className='h-28 w-full' />
            <Skeleton className='h-9 w-24' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

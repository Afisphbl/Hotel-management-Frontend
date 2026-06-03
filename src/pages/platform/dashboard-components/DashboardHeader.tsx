export function DashboardHeader() {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
          Platform
        </h1>
        <p className='text-sm text-muted-foreground'>
          Metrics across all properties.
        </p>
      </div>
    </div>
  );
}

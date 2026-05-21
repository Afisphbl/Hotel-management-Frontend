import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MoneyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  decimals?: number;
}

export function MoneyDisplay({
  amount,
  currency = "ETB",
  className,
  decimals = 2,
}: MoneyDisplayProps) {
  const formatted = new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimals,
  }).format(amount);

  return (
    <span className={cn("font-mono font-medium", className)}>{formatted}</span>
  );
}

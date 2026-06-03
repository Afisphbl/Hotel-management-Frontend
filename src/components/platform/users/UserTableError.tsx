import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserTableErrorProps {
  message?: string;
  onRetry: () => void;
}

export function UserTableError({ message, onRetry }: UserTableErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Database className="w-10 h-10 text-red-400 mb-3" />
      <h3 className="text-lg font-serif text-slate-500">
        Failed to load users
      </h3>
      <p className="text-xs text-slate-400 mt-1 mb-4">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

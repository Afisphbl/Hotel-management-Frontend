import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface AuditLogsTabProps {
  hotelId: string;
}

export function AuditLogsTab({ hotelId }: AuditLogsTabProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`hotel/owner/hotels/${hotelId}/audit-logs?limit=50`);
        setLogs(res.data || res || []);
      } catch {
        toast.error('Failed to load audit logs');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [hotelId]);

  if (isLoading) return <div className="py-10 text-center text-muted-foreground italic">Loading...</div>;

  return (
    <div className="space-y-3">
      {logs.map((l) => (
        <div key={l.id} className="p-3 border rounded-lg bg-slate-50/50 flex items-start gap-3">
          <div className="mt-1 p-1 bg-white border rounded">
            <Activity className="w-3 h-3 text-muted-foreground" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">{new Date(l.createdAt).toLocaleString()}</div>
            <div className="text-sm"><span className="font-semibold">{l.actor}</span> {l.action}</div>
          </div>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="py-10 text-center text-muted-foreground italic">No activity logs recorded yet.</div>
      )}
    </div>
  );
}

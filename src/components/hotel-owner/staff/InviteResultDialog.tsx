import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface InviteResultDialogProps {
  result: { email: string; tempPassword?: string } | null;
  onClose: () => void;
}

export function InviteResultDialog({ result, onClose }: InviteResultDialogProps) {
  return (
    <Dialog open={!!result} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Staff Invited Successfully</DialogTitle>
          <DialogDescription>
            Share the credentials below with the new staff member.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-slate-50 p-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
              <p className="text-sm font-semibold text-[#0F1B2D] mt-0.5">{result?.email}</p>
            </div>
            {result?.tempPassword && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Temporary Password</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <code className="flex-1 bg-white border rounded px-3 py-1.5 text-sm font-mono text-[#0F1B2D] select-all">
                    {result.tempPassword}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(result.tempPassword!);
                      toast.success('Password copied');
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Make sure to share this securely. The staff member can change it after first login.
                </p>
              </div>
            )}
            {!result?.tempPassword && (
              <p className="text-sm text-muted-foreground">This user already existed. They can log in with their existing password.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-[#0F1B2D]">Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

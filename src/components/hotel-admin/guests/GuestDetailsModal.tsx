import { cn, formatDate, getGuestName } from '@/lib/utils';

interface GuestDetailsModalProps {
  guest: any;
  onClose: () => void;
}

export function GuestDetailsModal({ guest, onClose }: GuestDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">Guest Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold", guest.isVip ? "bg-[#C9973A] text-white" : "bg-[#0F1B2D] text-[#C9973A]")}>
              {getGuestName(guest).charAt(0) || 'G'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F1B2D] flex items-center gap-2">
                {getGuestName(guest)}
                {guest.isVip && <span className="text-xs bg-[#C9973A]/10 text-[#C9973A] px-2 py-0.5 rounded font-bold uppercase">VIP</span>}
              </h3>
              <p className="text-sm text-muted-foreground">{guest.email || 'No email'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Phone</span><p className="font-medium">{guest.phone || '—'}</p></div>
            <div><span className="text-muted-foreground">Nationality</span><p className="font-medium">{guest.nationality || '—'}</p></div>
            <div><span className="text-muted-foreground">ID Number</span><p className="font-medium">{guest.documentNumber || guest.idNumber || '—'}</p></div>
            <div><span className="text-muted-foreground">Created</span><p className="font-medium">{guest.createdAt ? formatDate(guest.createdAt) : '—'}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ShieldX } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 max-w-sm w-full px-4">
        <div className="mx-auto w-16 h-16 bg-[#0F1B2D] rounded-[4px] flex items-center justify-center shadow-lg">
          <ShieldX className="w-8 h-8 text-[#C9973A]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif text-[#0F1B2D] tracking-tight">Access Denied</h1>
          <p className="text-[13px] leading-relaxed text-gray-500">
            You don't have permission to view this page. Contact your administrator if you believe this is a mistake.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={() => navigate({ to: "/" })} className="w-full bg-[#0F1B2D] hover:bg-[#0F1B2D]/90 text-white">
            Go to Dashboard
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()} className="w-full text-gray-500">
            Go Back
          </Button>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <div className="w-1 h-1 bg-[#C9973A] rounded-full" />
          <div className="w-1 h-1 bg-[#C9973A]/40 rounded-full" />
          <div className="w-1 h-1 bg-[#C9973A]/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

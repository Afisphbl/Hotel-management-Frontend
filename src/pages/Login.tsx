
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, ShieldCheck, UserCog } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function LoginPage() {
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (role: any) => {
    login(role);
    const user = useAuthStore.getState().user;
    if (user?.scope === 'platform') {
      navigate({ to: '/platform/dashboard' });
    } else {
      navigate({ to: '/hotel/dashboard' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-none shadow-xl overflow-hidden rounded-[4px]">
        <CardHeader className="text-center space-y-4 pb-8 border-b border-[#F8F7F4]">
          <div className="mx-auto w-12 h-12 bg-[#0F1B2D] rounded-[4px] flex items-center justify-center shadow-md">
            <Hotel className="text-[#C9973A] w-6 h-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-serif text-[#0F1B2D] tracking-tight">LuxeHotel</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9973A]">Management System</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-8 pb-8 px-8">
          <Button 
            className="w-full h-11 justify-start gap-4 rounded-[4px] bg-[#0F1B2D] hover:bg-[#1e2d44] transition-all"
            onClick={() => handleLogin('SUPER_ADMIN')}
          >
            <ShieldCheck className="w-4 h-4 text-[#C9973A]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F8F7F4]">Platform Manager</span>
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-11 justify-start gap-4 rounded-[4px] border-[#0F1B2D] text-[#0F1B2D] hover:bg-[#0F1B2D] hover:text-white transition-all"
            onClick={() => handleLogin('HOTEL_OWNER')}
          >
            <UserCog className="w-4 h-4 text-[#C9973A]" />
            <span className="text-xs font-bold uppercase tracking-widest">Property Admin</span>
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-11 justify-start gap-4 rounded-[4px] border-[#0F1B2D]/20 text-[#0F1B2D] hover:bg-[#0F1B2D]/5 transition-all"
            onClick={() => handleLogin('FRONT_DESK')}
          >
            <Hotel className="w-4 h-4 text-[#C9973A]" />
            <span className="text-xs font-bold uppercase tracking-widest">Front Desk</span>
          </Button>
        </CardContent>
        <CardFooter className="bg-[#0F1B2D] py-3 text-center justify-center">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Select Access Tier to Continue</p>
        </CardFooter>
      </Card>
    </div>
  );
}

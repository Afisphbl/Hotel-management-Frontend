import React from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Hotel,
  ShieldCheck,
  UserCog,
  Mail,
  Lock,
  Key,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [hotelId, setHotelId] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleQuickFill = (
    emailVal: string,
    passwordVal: string,
    hotelIdVal: string,
  ) => {
    setError(null);
    setEmail(emailVal);
    setPassword(passwordVal);
    setHotelId(hotelIdVal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(email, password, hotelId || undefined);
      const user = useAuthStore.getState().user;
      if (user?.scope === "platform") {
        navigate({ to: "/platform/dashboard" });
      } else {
        navigate({ to: "/hotel/dashboard" });
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Login failed, please check your network and credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const SEEDED_PRESETS = [
    {
      category: "Platform Control Board",
      items: [
        { name: "System Admin", email: "admin@platform.com", pass: "Admin123!" },
        { name: "Hotel Admin", email: "admin@hotels.com", pass: "Admin123!" },
      ],
    },
    {
      category: "The Grand Budapest Hotel",
      hotelId: "f4dfac16-a26b-41c8-ab62-991ea7f703f5",
      items: [
        { name: "Owner", email: "hotel_owner@budapest.com", pass: "Admin123!" },
        { name: "Manager", email: "hotel_manager@budapest.com", pass: "Admin123!" },
        { name: "Revenue Mgr", email: "revenue_manager@budapest.com", pass: "Admin123!" },
        { name: "Front Desk", email: "front_desk@budapest.com", pass: "Admin123!" },
        { name: "Accountant", email: "accountant@budapest.com", pass: "Admin123!" },
        { name: "HK Supervisor", email: "housekeeping_supervisor@budapest.com", pass: "Admin123!" },
        { name: "Housekeeper", email: "housekeeping_staff@budapest.com", pass: "Admin123!" },
        { name: "Maintenance", email: "maintenance_staff@budapest.com", pass: "Admin123!" },
      ],
    },
    {
      category: "Seaside Resort & Spa",
      hotelId: "e55c4324-7483-4986-acdf-a85b7d517f9d",
      items: [
        { name: "Owner", email: "hotel_owner@seaside.com", pass: "Admin123!" },
        { name: "Manager", email: "hotel_manager@seaside.com", pass: "Admin123!" },
        { name: "Revenue Mgr", email: "revenue_manager@seaside.com", pass: "Admin123!" },
        { name: "Front Desk", email: "front_desk@seaside.com", pass: "Admin123!" },
        { name: "Accountant", email: "accountant@seaside.com", pass: "Admin123!" },
        { name: "HK Supervisor", email: "housekeeping_supervisor@seaside.com", pass: "Admin123!" },
        { name: "Housekeeper", email: "housekeeping_staff@seaside.com", pass: "Admin123!" },
        { name: "Maintenance", email: "maintenance_staff@seaside.com", pass: "Admin123!" },
      ],
    },
    {
      category: "Mountain View Lodge",
      hotelId: "ba1c95ad-921b-4965-bd1f-13c64e151ada",
      items: [
        { name: "Owner", email: "hotel_owner@mountain.com", pass: "Admin123!" },
        { name: "Manager", email: "hotel_manager@mountain.com", pass: "Admin123!" },
        { name: "Revenue Mgr", email: "revenue_manager@mountain.com", pass: "Admin123!" },
        { name: "Front Desk", email: "front_desk@mountain.com", pass: "Admin123!" },
        { name: "Accountant", email: "accountant@mountain.com", pass: "Admin123!" },
        { name: "HK Supervisor", email: "housekeeping_supervisor@mountain.com", pass: "Admin123!" },
        { name: "Housekeeper", email: "housekeeping_staff@mountain.com", pass: "Admin123!" },
        { name: "Maintenance", email: "maintenance_staff@mountain.com", pass: "Admin123!" },
      ],
    },
    {
      category: "City Center Business Hotel",
      hotelId: "8252c54a-78ce-491b-98e6-f6c8b856319c",
      items: [
        { name: "Owner", email: "hotel_owner@business.com", pass: "Admin123!" },
        { name: "Manager", email: "hotel_manager@business.com", pass: "Admin123!" },
        { name: "Revenue Mgr", email: "revenue_manager@business.com", pass: "Admin123!" },
        { name: "Front Desk", email: "front_desk@business.com", pass: "Admin123!" },
        { name: "Accountant", email: "accountant@business.com", pass: "Admin123!" },
        { name: "HK Supervisor", email: "housekeeping_supervisor@business.com", pass: "Admin123!" },
        { name: "Housekeeper", email: "housekeeping_staff@business.com", pass: "Admin123!" },
        { name: "Maintenance", email: "maintenance_staff@business.com", pass: "Admin123!" },
      ],
    },
  ];

  return (
    <div className='min-h-screen bg-[#F8F7F4] flex flex-col lg:flex-row items-center justify-center p-4 gap-8 max-w-6xl mx-auto'>
      {/* Brand Context Card */}
      <div className='w-full lg:max-w-lg space-y-5 text-center lg:text-left'>
        <div className='inline-flex w-12 h-12 bg-[#0F1B2D] rounded-[4px] items-center justify-center shadow-lg'>
          <Hotel className='text-[#C9973A] w-6 h-6' />
        </div>
        <div>
          <h1 className='text-3xl font-serif text-[#0F1B2D] tracking-tight font-bold'>
            LuxeHotel Portals
          </h1>
          <p className='text-xs text-gray-500 mt-1.5 leading-relaxed'>
            Enter your credentials manually, or select one of the database
            seeded roles from the presets below to automatically fill the form
            inputs.
          </p>
        </div>

        {/* Categorized Quick Fills */}
        <div className='pt-2 space-y-4'>
          {SEEDED_PRESETS.map((group, idx) => (
            <div
              key={idx}
              className='space-y-1.5 text-left border-l-2 border-[#C9973A] pl-3 py-0.5'
            >
              <h2 className='text-[10px] font-bold uppercase tracking-wider text-[#0F1B2D] opacity-60'>
                {group.category}
              </h2>
              <div className='flex flex-wrap gap-1.5'>
                {group.items.map((item, itemIdx) => (
                  <Button
                    key={itemIdx}
                    type='button'
                    variant='outline'
                    size='sm'
                    className='text-[10px] border-[#0F1B2D]/10 bg-white text-[#0F1B2D] hover:bg-[#0F1B2D] hover:text-white transition-all py-1 px-2.5 h-auto rounded-[3px] font-semibold'
                    onClick={() =>
                      handleQuickFill(item.email, item.pass, group.hotelId ?? "")
                    }
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Login Form */}
      <Card className='w-full max-w-md border-none shadow-2xl overflow-hidden rounded-[8px] bg-white'>
        <CardHeader className='text-center space-y-1.5 pb-6 border-b border-[#F8F7F4]'>
          <CardTitle className='text-2xl font-serif text-[#0F1B2D] tracking-tight'>
            Login Portal
          </CardTitle>
          <CardDescription className='text-xs text-gray-400'>
            Enter your credentials below to authenticate
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4 pt-6 pb-6 px-8'>
            {error && (
              <div className='bg-red-50 text-red-700 text-xs p-3 rounded-[4px] flex items-start gap-2 border border-red-100'>
                <AlertCircle className='w-4 h-4 shrink-0 mt-0.5 text-red-500' />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className='space-y-1.5'>
              <Label
                htmlFor='email'
                className='text-xs font-bold text-[#0F1B2D] uppercase tracking-wider'
              >
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  id='email'
                  type='email'
                  placeholder='admin@platform.com'
                  className='pl-10 h-11 border-gray-200 rounded-[4px] focus-visible:ring-[#C9973A]'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-1.5'>
              <Label
                htmlFor='password'
                className='text-xs font-bold text-[#0F1B2D] uppercase tracking-wider'
              >
                Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className='pl-10 h-11 border-gray-200 rounded-[4px] focus-visible:ring-[#C9973A]'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Hotel ID Field (Optional / Tenant scope) */}
            <div className='space-y-1.5 pt-1'>
              <div className='flex justify-between items-center'>
                <Label
                  htmlFor='hotelId'
                  className='text-xs font-bold text-[#0F1B2D] uppercase tracking-wider'
                >
                  Hotel ID (Required for staff)
                </Label>
                <span className='text-[10px] text-gray-400 font-medium italic'>
                  Optional for Platform Admin
                </span>
              </div>
              <div className='relative'>
                <Key className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  id='hotelId'
                  type='text'
                  placeholder='00000000-0000-0000-0000-000000000001'
                  className='pl-10 h-11 border-gray-200 rounded-[4px] focus-visible:ring-[#C9973A]'
                  value={hotelId}
                  onChange={(e) => setHotelId(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className='bg-[#0F1B2D] p-6 flex flex-col items-stretch gap-3'>
            <Button
              type='submit'
              disabled={loading}
              className='w-full h-11 rounded-[4px] bg-[#C9973A] text-white hover:bg-[#b0812e] disabled:bg-gray-700 transition-all font-bold text-xs uppercase tracking-wider shrink-0 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin text-white' />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In Securely</span>
              )}
            </Button>
            <p className='text-[10px] text-white/40 text-center uppercase tracking-widest font-semibold mt-1'>
              Multi-tenant SSL Encrypted Connection
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

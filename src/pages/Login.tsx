import React from "react";
import { useAuthStore, decodeJwt } from "@/store/authStore";
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
  Mail,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { getSubdomain } from "@/lib/subdomain";
import type { AuthUser, UserRole } from "@/types/auth";

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [isRestoring, setIsRestoring] = React.useState(true);

  // Detect subdomain from browser URL on mount
  const [detectedSubdomain] = React.useState(() => getSubdomain());

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Restore auth session when redirected from main domain with token
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("access_token");
    if (urlToken) {
      window.history.replaceState({}, "", window.location.pathname);
      const payload = decodeJwt(urlToken);
      if (payload) {
        const rawName = payload.email
          ? payload.email.split("@")[0]
          : "User";
        const formattedName = rawName
          .split(/[._-]/)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        const user: AuthUser = {
          sub: payload.sub || "user_123",
          email: payload.email || "",
          name: formattedName,
          role: (payload.role || "HOTEL_OWNER") as UserRole,
          scope: (payload.scope || "hotel") as "hotel" | "platform",
          hotel_id: payload.hotel_id || undefined,
          permissions: payload.permissions || [],
        };
        useAuthStore.setState({
          user,
          token: urlToken,
          originalToken: null,
          hotelSubdomain: detectedSubdomain,
        });
        const adminRoles = ["HOTEL_MANAGER", "HOTEL_ADMIN", "SUPER_ADMIN"];
        navigate({
          to:
            user.scope === "platform"
              ? "/platform/dashboard"
              : user.role === "HOTEL_OWNER"
                ? "/hotel/owner/dashboard"
                : adminRoles.includes(user.role)
                  ? "/hotel/admin/dashboard"
                  : "/hotel/dashboard",
        });
        return;
      }
    }
    setIsRestoring(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password, undefined, detectedSubdomain || undefined);
      if (!result) return;

      const { dashboardRoute, hotelSubdomain, access_token } = result;

      // If user has a hotel subdomain, redirect to subdomain-based URL
      if (hotelSubdomain) {
        const appDomain = (import.meta as any).env?.VITE_APP_DOMAIN;
        const protocol = window.location.protocol;
        // If already on a subdomain URL, keep current host
        const hostParts = window.location.hostname.split(".");
        const alreadyOnSubdomain = hostParts.length >= 3 || (hostParts.length >= 2 && hostParts[0] !== "localhost" && hostParts[0] !== "127" && hostParts[0] !== "127.0.0.1");
        if (!alreadyOnSubdomain && appDomain) {
          const subdomainUrl = `${protocol}//${hotelSubdomain}.${appDomain}/login?access_token=${encodeURIComponent(access_token)}`;
          window.location.href = subdomainUrl;
          return;
        }
      }

      if (dashboardRoute && dashboardRoute.length > 0) {
        navigate({ to: dashboardRoute });
        return;
      }

      const user = useAuthStore.getState().user;
      const adminRoles = ["HOTEL_MANAGER", "HOTEL_ADMIN", "SUPER_ADMIN"];
      navigate({
        to:
          user?.scope === "platform"
            ? "/platform/dashboard"
            : user?.role === "HOTEL_OWNER"
              ? "/hotel/owner/dashboard"
              : adminRoles.includes(user?.role ?? "")
                ? "/hotel/admin/dashboard"
                : "/hotel/dashboard",
      });
    } catch (err: any) {
      setError(
        err.message ||
          "Login failed, please check your network and credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isRestoring) {
    return (
      <div className='min-h-screen bg-[#F8F7F4] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='w-8 h-8 animate-spin text-[#C9973A]' />
          <span className='text-sm text-gray-500'>Restoring session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F8F7F4] flex flex-col lg:flex-row items-center justify-center p-4 gap-8 max-w-6xl mx-auto'>
      {/* Brand Context Card */}
      <div className='w-full lg:max-w-lg space-y-5 text-center lg:text-left'>
        <div className='inline-flex w-12 h-12 bg-[#0F1B2D] rounded-md items-center justify-center shadow-lg'>
          <Hotel className='text-[#C9973A] w-6 h-6' />
        </div>
        <div>
          <h1 className='text-3xl font-serif text-[#0F1B2D] tracking-tight font-bold'>
            LuxeHotel Portals
          </h1>
          <p className='text-xs text-gray-500 mt-1.5 leading-relaxed'>
            Enter your email and password to access your portal.
          </p>
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
              <div className='bg-red-50 text-red-700 text-xs p-3 rounded-md flex items-start gap-2 border border-red-100'>
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
                  className='pl-10 h-11 border-gray-200 rounded-md focus-visible:ring-[#C9973A]'
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
                  className='pl-10 h-11 border-gray-200 rounded-md focus-visible:ring-[#C9973A]'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>


          </CardContent>

          <CardFooter className='bg-[#0F1B2D] p-6 flex flex-col items-stretch gap-3'>
            <Button
              type='submit'
              disabled={loading}
              className='w-full h-11 rounded-md bg-[#C9973A] text-white hover:bg-[#b0812e] disabled:bg-gray-700 transition-all font-bold text-xs uppercase tracking-wider shrink-0 flex items-center justify-center gap-2'
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

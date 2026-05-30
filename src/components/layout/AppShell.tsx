import React from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Hotel,
  CreditCard,
  Flag,
  ShieldAlert,
  History,
  Menu,
  ChevronLeft,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  Calendar,
  Users,
  Bed,
  MapPin,
  ClipboardList,
  Wrench,
  BarChart3,
  DollarSign,
  Tag,
  X,
  Building2,
  ReceiptText,
  Sparkles,
  Shield,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useNotificationStore } from "@/store/notificationStore";
import { format } from "date-fns";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  permission?: string;
}

const PLATFORM_NAV: NavItem[] = [
  { title: "Dashboard", href: "/platform/dashboard", icon: LayoutDashboard },
  { title: "Hotels", href: "/platform/hotels", icon: Hotel },
  { title: "Subscriptions", href: "/platform/subscriptions", icon: CreditCard },
  { title: "Feature Flags", href: "/platform/feature-flags", icon: Flag },
  {
    title: "Roles & Permissions",
    href: "/platform/roles-permissions",
    icon: ShieldAlert,
  },
  { title: "Audit Logs", href: "/platform/audit-logs", icon: History },
];

const HOTEL_NAV: NavItem[] = [
  {
    title: "Dashboard",
    href: "/hotel/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard:read",
  },
  {
    title: "Bookings",
    href: "/hotel/bookings",
    icon: Calendar,
    permission: "booking:read",
  },
  {
    title: "Front Desk",
    href: "/hotel/front-desk",
    icon: ClipboardList,
    permission: "front_desk:read",
  },
  { title: "Rooms", href: "/hotel/rooms", icon: Bed, permission: "room:read" },
  {
    title: "Availability",
    href: "/hotel/availability",
    icon: MapPin,
    permission: "availability:read",
  },
  {
    title: "Guests",
    href: "/hotel/guests",
    icon: Users,
    permission: "guest:read",
  },
  {
    title: "Pricing",
    href: "/hotel/pricing",
    icon: Tag,
    permission: "pricing:read",
  },
  {
    title: "Finance",
    href: "/hotel/finance",
    icon: DollarSign,
    permission: "finance:read",
  },
  {
    title: "Housekeeping",
    href: "/hotel/housekeeping",
    icon: ClipboardList,
    permission: "housekeeping:read",
  },
  {
    title: "Maintenance",
    href: "/hotel/maintenance",
    icon: Wrench,
    permission: "maintenance:read",
  },
  {
    title: "Staff",
    href: "/hotel/staff",
    icon: Users,
    permission: "staff:read",
  },
  {
    title: "Reports",
    href: "/hotel/reports",
    icon: BarChart3,
    permission: "reports:read",
  },
  {
    title: "Settings",
    href: "/hotel/settings",
    icon: Settings,
    permission: "settings:read",
  },
];

const HOTEL_OWNER_NAV: NavItem[] = [
  {
    title: "Dashboard",
    href: "/hotel/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Hotel & Branch Management",
    href: "/hotel/owner/hotels",
    icon: Hotel,
  },
  {
    title: "Rooms",
    href: "/hotel/owner/rooms",
    icon: Bed,
  },
  {
    title: "Staff",
    href: "/hotel/owner/staff",
    icon: Users,
  },
  {
    title: "Pricing",
    href: "/hotel/owner/pricing",
    icon: Tag,
  },
  {
    title: "Reports",
    href: "/hotel/owner/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/hotel/owner/settings",
    icon: Settings,
  },
];

const HOTEL_ADMIN_NAV: NavItem[] = [
  { title: "Dashboard", href: "/hotel/admin/dashboard", icon: LayoutDashboard },
  { title: "Property", href: "/hotel/admin/property", icon: Building2 },
  { title: "Rooms", href: "/hotel/admin/rooms", icon: Bed },
  { title: "Bookings", href: "/hotel/admin/bookings", icon: Calendar },
  { title: "Guests", href: "/hotel/admin/guests", icon: Users },
  { title: "Staff", href: "/hotel/admin/staff", icon: Shield },
  { title: "Pricing", href: "/hotel/admin/pricing", icon: Tag },
  { title: "Finance", href: "/hotel/admin/finance", icon: DollarSign },
  { title: "Invoices", href: "/hotel/admin/invoices", icon: ReceiptText },
  { title: "Payments", href: "/hotel/admin/payments", icon: CreditCard },
  { title: "Housekeeping", href: "/hotel/admin/housekeeping", icon: Sparkles },
  { title: "Maintenance", href: "/hotel/admin/maintenance", icon: Wrench },
  { title: "Reports", href: "/hotel/admin/reports", icon: BarChart3 },
  { title: "Settings", href: "/hotel/admin/settings", icon: Settings },
];

export function AppShell() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const originalToken = useAuthStore((state) => state.originalToken);
  const stopImpersonating = useAuthStore((state) => state.stopImpersonating);
  const logout = useAuthStore((state) => state.logout);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const navigate = useNavigate();
  const location = useLocation();

  const isImpersonating = !!originalToken;

  const adminRoles = ["HOTEL_MANAGER", "HOTEL_ADMIN", "SUPER_ADMIN"];

  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markRead,
    markAllRead,
  } = useNotificationStore();

  React.useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const navItems =
    user?.role === "HOTEL_OWNER"
      ? HOTEL_OWNER_NAV
      : user?.scope === "platform"
        ? PLATFORM_NAV
        : adminRoles.includes(user?.role ?? "")
          ? HOTEL_ADMIN_NAV
          : HOTEL_NAV.filter(
              (item) => !item.permission || hasPermission(item.permission),
            );

  // Debug logging
  React.useEffect(() => {
    console.log("🔍 AppShell Navigation Debug:", {
      user_email: user?.email,
      user_scope: user?.scope,
      user_role: user?.role,
      user_hotel_id: user?.hotel_id,
      navItemsCount: navItems.length,
      navItems: navItems.map((n) => n.title),
      timestamp: new Date().toISOString(),
    });
  }, [user, navItems]);

  const settingsHref =
    user?.scope === "platform"
      ? "/platform/settings"
      : user?.role === "HOTEL_OWNER"
        ? "/hotel/owner/settings"
        : adminRoles.includes(user?.role ?? "")
          ? "/hotel/admin/settings"
          : "/hotel/settings";

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className='flex h-screen bg-[#F8F7F4] text-[#0F1B2D] flex-col'>
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className='bg-amber-600 text-white px-4 py-2 flex items-center justify-between text-sm font-bold z-50'>
          <div className='flex items-center gap-2'>
            <ShieldAlert className='w-4 h-4' />
            <span>Currently impersonating: {user?.email}</span>
          </div>
          <Button
            size='sm'
            variant='secondary'
            className='h-7 bg-white text-amber-700 hover:bg-white/90'
            onClick={stopImpersonating}
          >
            Return to Super Admin
          </Button>
        </div>
      )}

      <div className='flex flex-1 overflow-hidden'>
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex bg-[#0F1B2D] text-white transition-all duration-300 flex-col z-20 shadow-xl shrink-0",
            collapsed ? "w-20" : "w-64",
          )}
        >
          <div className='p-6 flex items-center justify-between h-16 border-b border-white/10 shrink-0'>
            {!collapsed && (
              <div className='flex items-center gap-3 overflow-hidden whitespace-nowrap'>
                <div className='w-8 h-8 bg-[#C9973A] rounded-md flex items-center justify-center font-bold text-white shrink-0'>
                  L
                </div>
                <h1 className='font-serif font-bold text-lg tracking-tight'>
                  LuxeHotel
                </h1>
              </div>
            )}
            {collapsed && (
              <div className='w-8 h-8 bg-[#C9973A] rounded-md flex items-center justify-center font-bold text-white mx-auto'>
                L
              </div>
            )}
          </div>

          <nav className='flex-1 p-4 space-y-2 text-sm overflow-y-auto'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-colors group",
                  location.pathname.startsWith(item.href)
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    location.pathname.startsWith(item.href)
                      ? "text-[#C9973A]"
                      : "group-hover:text-[#C9973A]",
                  )}
                />
                {!collapsed && (
                  <span className='font-medium'>{item.title}</span>
                )}
                {collapsed && (
                  <div className='absolute left-16 bg-[#0F1B2D] text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-lg'>
                    {item.title}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          <div className='p-4 border-t border-white/10 shrink-0'>
            <div
              className={cn(
                "flex items-center gap-3 p-2 bg-white/5 rounded-md relative group/user",
                collapsed ? "justify-center" : "justify-between",
              )}
            >
              <div className='flex items-center gap-3 min-w-0'>
                <Avatar className='h-8 w-8 rounded-full border border-white/10 shrink-0'>
                  <AvatarImage
                    src={`https://avatar.iran.liara.run/username?username=${user?.name}`}
                  />
                  <AvatarFallback className='bg-[#C9973A] text-[#0F1B2D] text-[10px] font-bold'>
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className='min-w-0'>
                    <p className='text-xs text-white font-medium truncate'>
                      {user?.name}
                    </p>
                    <p className='text-[10px] text-white/50 truncate capitalize'>
                      {user?.role?.toLowerCase().replace("_", " ")}
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant='ghost'
                size='icon'
                className={cn(
                  "h-6 w-6 text-white/30 hover:text-white hover:bg-white/10 transition-all",
                  collapsed
                    ? "absolute -right-3 top-1/2 -translate-y-1/2 bg-[#0F1B2D] border border-white/10 rounded-full z-30"
                    : "",
                )}
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronLeft className='w-3 h-3 rotate-180' />
                ) : (
                  <ChevronLeft className='w-3 h-3' />
                )}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
          {/* Header */}
          <header className='h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm'>
            <div className='flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-bold'>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant='ghost'
                      size='icon'
                      className='md:hidden h-8 w-8 text-[#0F1B2D]'
                    />
                  }
                >
                  <Menu className='w-5 h-5' />
                </SheetTrigger>
                <SheetContent
                  side='left'
                  className='p-0 bg-[#0F1B2D] border-none text-white w-70 flex flex-col'
                >
                  <div className='p-6 flex items-center gap-3 border-b border-white/10 shrink-0'>
                    <div className='w-8 h-8 bg-[#C9973A] rounded-md flex items-center justify-center font-bold text-white shrink-0'>
                      L
                    </div>
                    <h1 className='font-serif font-bold text-lg tracking-tight'>
                      LuxeHotel
                    </h1>
                  </div>
                  <nav className='flex-1 p-4 space-y-1 text-sm overflow-y-auto'>
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-md transition-colors group",
                          location.pathname.startsWith(item.href)
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            location.pathname.startsWith(item.href)
                              ? "text-[#C9973A]"
                              : "group-hover:text-[#C9973A]",
                          )}
                        />
                        <span className='font-medium'>{item.title}</span>
                      </Link>
                    ))}
                  </nav>
                  <div className='p-4 border-t border-white/10 shrink-0'>
                    <div className='flex items-center gap-3 p-2 bg-white/5 rounded-md'>
                      <Avatar className='h-8 w-8 rounded-full border border-white/10 shrink-0'>
                        <AvatarImage
                          src={`https://avatar.iran.liara.run/username?username=${user?.name}`}
                        />
                        <AvatarFallback className='bg-[#C9973A] text-[#0F1B2D] text-[10px] font-bold'>
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0'>
                        <p className='text-xs text-white font-medium truncate'>
                          {user?.name}
                        </p>
                        <p className='text-[10px] text-white/50 truncate capitalize'>
                          {user?.role?.toLowerCase().replace("_", " ")}
                        </p>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleLogout}
                        className='ml-auto h-8 w-8 text-white/30 hover:text-red-500'
                      >
                        <LogOut className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <span className='hidden sm:inline'>LuxeHotel</span>
              <span className='text-gray-300 hidden sm:inline'>/</span>
              <span className='text-[#0F1B2D] truncate max-w-37.5 sm:max-w-none'>
                {location.pathname
                  .split("/")
                  .filter(Boolean)
                  .slice(1)
                  .join(" / ") || "Dashboard"}
              </span>
            </div>

            <div className='flex items-center gap-2 md:gap-6'>
              <div className='relative hidden lg:block'>
                <Search className='w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search...'
                  className='bg-[#F3F4F6] border-none rounded-md py-1.5 pl-9 pr-4 text-xs w-48 focus:ring-1 focus:ring-[#C9973A] outline-none transition-all'
                />
              </div>

              <div className='flex items-center gap-1 md:gap-4'>
                <DropdownMenu
                  onOpenChange={(open: boolean) => {
                    if (open) {
                      fetchNotifications();
                      fetchUnreadCount();
                    }
                  }}
                >
                  <DropdownMenuTrigger>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-gray-400 hover:text-[#0F1B2D] relative'
                      aria-label='Open notifications'
                    >
                      <Bell className='w-4 h-4' />
                      {unreadCount > 0 && (
                        <span className='absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full'>
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    sideOffset={8}
                    className='w-80'
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className='overflow-y-auto max-h-72'>
                        {loading ? (
                          <div className='p-4 text-center text-sm text-gray-500'>
                            Loading...
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className='p-4 text-center text-sm text-gray-500'>
                            No notifications
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <DropdownMenuItem
                              key={n.id}
                              className={cn(
                                "flex flex-col items-start gap-0.5 py-2 cursor-pointer",
                                !n.readAt && "bg-blue-50/50",
                              )}
                              onClick={() => {
                                if (!n.readAt) markRead(n.id);
                              }}
                            >
                              <div className='flex items-center justify-between w-full'>
                                <span className='text-sm font-medium'>
                                  {n.title}
                                </span>
                                <span className='text-[10px] text-gray-400'>
                                  {format(
                                    new Date(n.createdAt),
                                    "MMM d, HH:mm",
                                  )}
                                </span>
                              </div>
                              <p className='text-xs text-gray-500 line-clamp-2'>
                                {n.body}
                              </p>
                            </DropdownMenuItem>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={markAllRead}
                            className='justify-center text-xs text-blue-600 font-medium cursor-pointer'
                          >
                            Mark all as read
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hidden sm:flex h-8 w-8 text-gray-400 hover:text-[#0F1B2D]'
                  onClick={() => navigate({ to: settingsHref })}
                  aria-label='Open settings'
                >
                  <Settings className='w-4 h-4' />
                </Button>
                {/* <Separator
                orientation='vertical'
                className='hidden sm:block h-4 mx-2'
              /> */}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleLogout}
                  className='hidden sm:flex h-8 w-8 text-gray-400 hover:text-red-500'
                >
                  <LogOut className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className='flex-1 overflow-y-auto p-4 md:p-8'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

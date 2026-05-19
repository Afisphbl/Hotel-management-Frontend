
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthUser, UserRole } from '@/types/auth';

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'],
  HOTEL_OWNER: ['*'],
  HOTEL_MANAGER: [
    'dashboard:read', 'booking:*', 'front_desk:*', 'room:*', 'guest:*', 
    'availability:read', 'reports:read', 'staff:*', 'maintenance:*', 'housekeeping:*'
  ],
  REVENUE_MANAGER: [
    'dashboard:read', 'booking:read', 'pricing:*', 'reports:read', 'availability:read'
  ],
  FRONT_DESK: [
    'dashboard:read', 'booking:*', 'front_desk:*', 'room:read', 'guest:read', 'availability:read'
  ],
  ACCOUNTANT: [
    'dashboard:read', 'finance:*', 'booking:read', 'reports:read'
  ],
  HOUSEKEEPING_SUPERVISOR: [
    'housekeeping:*', 'room:read', 'reports:read'
  ],
  HOUSEKEEPING_STAFF: [
    'housekeeping:own_tasks'
  ],
  MAINTENANCE_STAFF: [
    'maintenance:own_tickets'
  ],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (role) => {
        const scope = role === 'SUPER_ADMIN' ? 'platform' : 'hotel';
        const mockUser: AuthUser = {
          sub: 'user_123',
          email: `${role.toLowerCase()}@example.com`,
          name: role.replace('_', ' '),
          role,
          scope,
          hotel_id: scope === 'hotel' ? 'hotel_789' : undefined,
          permissions: ROLE_PERMISSIONS[role],
        };
        set({ user: mockUser, token: 'mock_jwt_token' });
      },
      logout: () => set({ user: null, token: null }),
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        if (user.permissions.includes('*')) return true;
        
        const [resource, action] = permission.split(':');
        return user.permissions.some(p => {
          const [pResource, pAction] = p.split(':');
          if (pResource === resource && (pAction === '*' || pAction === action)) return true;
          return false;
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

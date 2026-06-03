import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

interface ProfileTabProps {
  initialName: string;
}

export function ProfileTab({ initialName }: ProfileTabProps) {
  const { user } = useAuthStore();
  const [profileName, setProfileName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!profileName.trim()) return toast.error("Name cannot be empty");
    const parts = profileName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || firstName;
    setIsSavingProfile(true);
    try {
      await api.patch("auth/profile", { firstName, lastName });
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e.message ?? "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");
    setIsChangingPassword(true);
    try {
      await api.post("auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e.message ?? "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-none bg-white shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                value={user?.email ?? ""}
                disabled
                className="max-w-sm text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input
                value={user?.role?.replace(/_/g, " ") ?? ""}
                disabled
                className="max-w-sm text-muted-foreground capitalize"
              />
            </div>
            <Button
              onClick={handleUpdateProfile}
              disabled={isSavingProfile}
              className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
            >
              {isSavingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
            >
              {isChangingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

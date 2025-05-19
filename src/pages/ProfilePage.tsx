import { ProfileForm } from '@/components/features/profile/ProfileForm';

export function ProfilePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <ProfileForm />
    </div>
  );
} 
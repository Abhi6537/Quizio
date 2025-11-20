// File: src/components/UserMenu.tsx
import { useEffect, useState } from 'react';
import { User, LogOut, Trophy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserMenuProps {
  username: string;
  // optional: a parent component can pass the avatar URL directly
  avatarUrl?: string | null;
}

export const UserMenu = ({ username, avatarUrl: avatarUrlProp }: UserMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(avatarUrlProp ?? null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // if parent already passed avatarUrl, use it and skip fetch
    if (avatarUrlProp) {
      setAvatarUrl(avatarUrlProp);
      return;
    }

    const fetchAvatar = async () => {
      setLoading(true);
      try {
        // get current session/user
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn('Supabase getSession error:', sessionError);
          setLoading(false);
          return;
        }

        const userId = session?.user?.id;
        if (!userId) {
          setLoading(false);
          return;
        }

        // fetch avatar_url from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.warn('Supabase profiles select error:', error);
        } else if (data?.avatar_url) {
          // If avatar_url is a storage path (like 'avatars/..'), transform to public URL.
          // If it's already a full URL, use as-is.
          const avatar = data.avatar_url as string;

          // detect if it's a Supabase storage path (doesn't include protocol) or a full URL
          if (/^https?:\/\//i.test(avatar)) {
            setAvatarUrl(avatar);
          } else {
            // Example storage path: 'avatars/<userId>/avatar.png'
            // Attempt to build a public URL from your Supabase storage base.
            // If your avatars are public in the 'avatars' bucket, this pattern works:
            // `${SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`
            // But safer: try to use supabase.storage.from(...).getPublicUrl if available.
            try {
              const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(avatar);
              if (publicUrlData?.publicUrl) {
                setAvatarUrl(publicUrlData.publicUrl);
              } else {
                // fallback: set raw avatar (might work if already a public path)
                setAvatarUrl(avatar);
              }
            } catch (err) {
              console.warn('Error building public url for avatar:', err);
              setAvatarUrl(avatar);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch avatar:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [avatarUrlProp]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0 overflow-hidden">
          {/* avatar display */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${username ?? 'User'} avatar`}
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                // if image fails to load, hide it so the fallback icon shows
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            // fallback icon while loading or if no avatar
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hello, {username || 'User'}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/leaderboard')}>
          <Trophy className="mr-2 h-4 w-4" />
          <span>Leaderboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserMenu;

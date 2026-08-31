'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Images, Rocket } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from './logout-button';
import { createClient } from '@/lib/supabase/client';

export type UserProfile = {
  id?: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
};

export interface UserProfileMenuProps {
  user?: {
    id?: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      display_name?: string;
      name?: string;
      avatar_url?: string;
      picture?: string;
      username?: string;
      user_name?: string;
      preferred_username?: string;
      [key: string]: unknown;
    };
    profile?: UserProfile | null;
    [key: string]: unknown;
  } | null;
  profile?: UserProfile | null;
  showDetailsInTrigger?: boolean;
}

export function UserProfileMenu({
  user,
  profile: propProfile,
  showDetailsInTrigger = true,
}: UserProfileMenuProps) {
  const [profile, setProfile] = useState<UserProfile | null>(
    propProfile ?? user?.profile ?? null
  );

  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile);
      return;
    }
    if (user?.profile) {
      setProfile(user.profile);
      return;
    }

    if (user?.id) {
      const supabase = createClient();
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(data);
          }
        });
    }
  }, [user, propProfile]);

  const username =
    profile?.username ||
    user?.profile?.username ||
    user?.user_metadata?.username ||
    user?.user_metadata?.user_name ||
    user?.user_metadata?.preferred_username ||
    (user?.email ? user.email.split('@')[0] : 'user');

  const displayName =
    profile?.display_name ||
    user?.profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    username ||
    user?.email ||
    'User';

  const avatarUrl =
    profile?.avatar_url ||
    user?.profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    '';

  const initials = (displayName || 'U').slice(0, 2).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex flex-row gap-2 items-center text-left focus:outline-none">
          <Avatar className="cursor-pointer w-10 h-10 rounded-md object-cover">
            <AvatarImage src={avatarUrl} alt={displayName} className='object-cover' />
            <AvatarFallback className="w-10 h-10 rounded-md">
              {initials}
            </AvatarFallback>
          </Avatar>
          {showDetailsInTrigger && (
            <div className="text-sm">
              <p className="font-medium leading-snug">{displayName}</p>
              <p className="text-muted-foreground leading-snug">@{username}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" style={{ width: '250px' }}>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{displayName}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user?.email || `@${username}`}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/@${username}`}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/profile/posts/new`} className="cursor-pointer">
            <Rocket className="mr-2 h-4 w-4" />
            Launch Place
            <div className="grow flex justify-end">
              <Badge>Beta</Badge>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile/setup" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/file-manager" className="cursor-pointer">
            <Images className="mr-2 h-4 w-4" />
            File Manager
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

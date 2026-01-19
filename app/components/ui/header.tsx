'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { signOut } from '@/app/auth/actions';
import { useAuthStore } from '@/store/useAuth';
import { Zap, LogOut } from 'lucide-react';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsDropdownOpen(false);
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="border-border sticky top-0 z-20 flex items-center justify-between border-b bg-white/5 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
          <Zap className="h-5 w-5 fill-white text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">AI VIP PRO</h1>
          <p className="text-muted-foreground flex items-center gap-1 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Online
          </p>
        </div>
      </div>

      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 active:scale-95"
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-600 text-xs font-bold text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </button>

          {isDropdownOpen && (
            <div className="ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-white/10 bg-[#1a1a1a] p-1 shadow-2xl ring-1 ring-black focus:outline-none">
              <div className="mb-1 border-b border-white/5 px-3 py-2 text-xs text-gray-400">
                <p className="truncate font-medium text-white">{user?.email}</p>
              </div>
              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  await signOut();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-all hover:bg-white/5 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

'use client';

import { AuthForm } from '@/app/components/auth-form';
import { useAuthStore } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  if (user) {
    router.push('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[10%] h-[80%] w-[80%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -right-[10%] -bottom-[40%] h-[80%] w-[80%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Zap className="h-8 w-8 fill-white text-white" />
          </div>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}

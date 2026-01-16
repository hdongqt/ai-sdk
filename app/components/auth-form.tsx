'use client';

import { useState } from 'react';
import { login, signInWithOAuth, signup } from '@/app/auth/actions';
import { Chrome, Loader2, LogIn } from 'lucide-react';

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {mode === 'login'
            ? 'Enter your details to sign in to your account'
            : 'Join us today and start your journey'}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <button
            onClick={() => signInWithOAuth('google')}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <span className="text-lg">Google</span>
            <LogIn />
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0a0a0a] px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <form action={mode === 'login' ? login : signup} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder=""
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

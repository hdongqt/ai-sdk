import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4 text-center">
      <div className="mb-6 rounded-full bg-red-500/10 p-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-white">
        Authentication Error
      </h1>
      <p className="mb-8 text-gray-400">
        Something went wrong during the authentication process. Please try
        again.
      </p>
      <Link
        href="/login"
        className="rounded-xl bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
      >
        Back to Login
      </Link>
    </div>
  );
}

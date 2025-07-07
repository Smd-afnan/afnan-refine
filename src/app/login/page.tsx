
'use client';
import { useAuth, AuthLoadingSpinner } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <AuthLoadingSpinner />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-900 p-4">
        <div className="text-center max-w-md">
            <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-xl">
                    <Sparkles className="w-9 h-9 text-white" />
                </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent font-headline dark:text-white">
                Welcome to SoulRefine
            </h1>
            <p className="text-lg mt-2 text-emerald-700 dark:text-emerald-300">
                Train your soul. Refine your character. Begin your journey of self-purification.
            </p>
            <Button onClick={signInWithGoogle} className="mt-8 px-8 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg">
                Sign in with Google
            </Button>
        </div>
    </div>
  );
}

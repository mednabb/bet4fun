'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace('/matches'); }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
      <div className="animate-spin-slow w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full" />
    </div>
  );
}

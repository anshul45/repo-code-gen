'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Chat } from "@/components/Chat";

export default function CreateLandingPage() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/sign-in');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="w-full h-[calc(100vh-29px)] flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (status === 'authenticated') {
        return (
            <main className="w-full h-[calc(100vh-29px)] px-4 pt-2 pb-2 gap-4 bg-gray-100 dark:bg-gray-900 min-w-[1000px] overflow-hidden min-h-0">
                <Chat mode="landing-page" />
            </main>
        );
    }

    return null;
}

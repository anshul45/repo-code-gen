'use client';

import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Chat } from "@/components/Chat";
import { useChatStore } from "@/store/chat";

export default function CreatePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { projectId, messages } = useChatStore();
    
    useEffect(() => {
        // If not authenticated, redirect to login
        if (status === 'unauthenticated') {
            router.push('/auth/sign-in');
        }
        
        // If authenticated but no project, redirect to home
        if (status === 'authenticated' && !projectId) {
            router.push('/');
        }
    }, [status, projectId, router]);

    // Show loading while checking authentication or redirecting
    if (status === 'loading' || (status === 'authenticated' && !projectId)) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    // If we have a session and project, render the chat
    if (session) {
        return (
            <main className="w-full h-[calc(100vh-100px)]">
                <Chat mode="landing-page" userId={session?.id || ''} />
            </main>
        );
    }

    return null;
}

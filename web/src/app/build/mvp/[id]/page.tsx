'use client';

import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Chat } from "@/components/Chat";
import { useChatStore } from "@/store/chat";

export default function MVPPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { projectId } = useChatStore();
    
    useEffect(() => {
        // If not authenticated, redirect to login
        if (status === 'unauthenticated') {
            router.push('/auth/sign-in');
        }
    }, [status, router]);

    // Show loading while checking authentication
    if (status === 'loading') {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    // If we have a session, render the chat with the ID from the URL
    if (session) {
        return (
            <main className="w-full h-[calc(100vh-100px)]">
                <Chat 
                    mode="default" 
                    userId={session?.id || ''} 
                    projectId={params.id}
                />
            </main>
        );
    }

    return null;
}

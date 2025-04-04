'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Chat } from "@/components/Chat";
import { useChatStore } from "@/store/chat";

export default function CreatePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const { projectId: chatProjectId } = useChatStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // If not authenticated, redirect to login
        if (status === 'unauthenticated') {
            router.push('/auth/sign-in');
        }

        // Get projectId from URL if available
        const urlProjectId = searchParams.get('projectId');
        
        if (status === 'authenticated') {
            if (urlProjectId || chatProjectId) {
                // We have a project ID either from URL or chat store
                setIsInitialized(true);
            } else {
                // If no project ID in chat or URL, redirect to home
                router.push('/');
            }
        }
    }, [status, chatProjectId, router, searchParams]);

    // Show loading while checking authentication or redirecting
    if (status === 'loading' || !isInitialized) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading project...</div>
            </div>
        );
    }

    // If we have a session, render the chat
    if (session) {
        const urlProjectId = searchParams.get('projectId');
        const projectIdToUse = urlProjectId || chatProjectId || '';
        
        return (
            <main className="w-full h-[calc(100vh-100px)]">
                <Chat 
                    mode="landing-page" 
                    userId={session?.id || ''} 
                    projectId={projectIdToUse}
                />
            </main>
        );
    }

    return null;
}

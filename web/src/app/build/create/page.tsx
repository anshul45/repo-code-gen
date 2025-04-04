'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Chat } from "@/components/Chat";
import { useChatStore } from "@/store/chat";
import { useProjectStore } from "@/store/projectStore";

export default function CreatePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const { projectId: chatProjectId, setProject } = useChatStore();
    const { loadProject, currentProject, isLoading, error, files } = useProjectStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // If not authenticated, redirect to login
        if (status === 'unauthenticated') {
            router.push('/auth/sign-in');
        }

        // Get projectId from URL if available
        const urlProjectId = searchParams.get('projectId');
        
        if (status === 'authenticated') {
            if (urlProjectId) {
                // Load project data if projectId is in URL
                loadProject(urlProjectId).then(() => {
                    setIsInitialized(true);
                });
            } else if (!chatProjectId) {
                // If no project ID in chat or URL, redirect to home
                router.push('/');
            } else {
                setIsInitialized(true);
            }
        }
    }, [status, chatProjectId, router, searchParams, loadProject, setProject]);

    // Update chat store when project is loaded
    useEffect(() => {
        if (currentProject && currentProject.id) {
            setProject(currentProject.id, currentProject.name);
        }
    }, [currentProject, setProject]);

    // Show loading while checking authentication, loading project, or redirecting
    if (status === 'loading' || isLoading || !isInitialized) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading project...</div>
                {isLoading && <div className="text-gray-400 mt-2">Loading files...</div>}
            </div>
        );
    }

    // Handle project loading error
    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center flex-col gap-4">
                <div className="text-red-500">Error loading project: {error.message}</div>
                <button 
                    className="px-4 py-2 bg-primary text-white rounded"
                    onClick={() => router.push('/')}
                >
                    Return to Home
                </button>
            </div>
        );
    }

    // If we have a session and project, render the chat
    if (session) {
        return (
            <main className="w-full h-[calc(100vh-100px)]">
                <Chat 
                    mode="landing-page" 
                    userId={session?.id || ''} 
                />
            </main>
        );
    }

    return null;
}

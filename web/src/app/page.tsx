'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function HomePage() {
    const router = useRouter();
    const { status } = useSession();
    const [buildIdea, setBuildIdea] = useState('');
    const [projectType, setProjectType] = useState('mvp');

    if (status === 'loading') {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/auth/sign-in');
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Store the build idea in local storage or state management
        if (buildIdea.trim()) {
            localStorage.setItem('buildIdea', buildIdea);
        }
        
        // Redirect based on selection
        if (projectType === 'landing-page') {
            router.push('/build/create');
        } else {
            router.push('/build/mvp');
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0E121A]">
            <div className="max-w-xl w-full px-6">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold mb-2 text-white">Curie</h1>
                    <h2 className="text-3xl font-semibold mt-8 mb-1 text-white">What do you want to build?</h2>
                    <p className="text-gray-400">Prompt, run, edit, and deploy full-stack <span className="text-white">web</span> and <span className="text-white">mobile</span> apps.</p>
                </div>
                
                <div className="space-y-4">
                    <div className="relative w-full">
                        <textarea
                            id="buildIdea"
                            placeholder="How can Curie help you today?"
                            value={buildIdea}
                            onChange={(e) => setBuildIdea(e.target.value)}
                            className="w-full p-6 text-lg bg-[#1E2431] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none placeholder:text-gray-400"
                        />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <Button type="button" onClick={handleSubmit} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center">
                                <Sparkles className="mr-2 h-5 w-5" /> Get Started
                            </Button>
                        </div>
                        
                        <div className="w-32">
                            <Select value={projectType} onValueChange={setProjectType}>
                                <SelectTrigger className="bg-[#1E2431] border-gray-700 text-white focus:ring-blue-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1E2431] border-gray-700 text-white">
                                    <SelectItem value="mvp">MVP</SelectItem>
                                    <SelectItem value="landing-page">Landing Page</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="pt-8 flex justify-center space-x-4">
                        <div className="text-sm text-gray-400">or start a blank app with your favorite stack</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { redirect } from 'next/navigation';
import { getSession } from '@/auth';
import { Chat } from "@/components/Chat";

export default async function HomePage() {
    const session = await getSession();

    if (!session) {
        redirect('/auth/sign-in');
    }

    return (
        <main className="w-full h-[calc(100vh-100px)]">
            <Chat />
        </main>
    );
}

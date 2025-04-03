import { redirect } from 'next/navigation';
import { getSession } from '@/auth';
import { Chat } from "@/components/Chat";

export default async function CreatePage() {
    const session = await getSession();
    console.log(session);

    if (!session) {
        redirect('/auth/sign-in');
    }

    return (
        <main className="w-full h-[calc(100vh-100px)]">
            <Chat mode="landing-page" />
        </main>
    );
}

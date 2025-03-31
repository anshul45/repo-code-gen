import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import { Providers } from "@/components/providers";

export default function CreateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <SidebarProvider>
                <div className="min-h-screen flex">
                    {/* Sidebar */}
                    <AppSidebar className="hidden md:block w-64 border-r" />
                    {/* Main content */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b">
                            <SidebarTrigger className="p-2 border-r" />
                            <div className="flex-1">
                                <Header />
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        </Providers>
    );
}

import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
      <body className="min-h-screen flex">
        <SidebarProvider>
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
        </SidebarProvider>
      </body>
    </html>
  );
}

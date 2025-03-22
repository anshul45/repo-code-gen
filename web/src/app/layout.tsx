import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Separator } from "@radix-ui/react-separator";

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
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
      <SidebarProvider>
      <AppSidebar />
        <main>
          <div className="flex items-center pt-2.5">
            <SidebarTrigger className="ml-2.5" />
          </div>
            {children}
        </main> 
    </SidebarProvider>
      </body>
    </html>
  );
}

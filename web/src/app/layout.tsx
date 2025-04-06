import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";



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
      <body>
        <Providers>
            <main className="flex-1">
            <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset className="flex-1">
        {children}
      </SidebarInset>
            </main>
        </Providers>
      </body>
    </html>
  );
}

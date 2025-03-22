import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

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
      <AppSidebar className="w-" />
          <div className="flex pt-2.5">
            <SidebarTrigger className="ml-2.5" />
          </div>
            {children}
    </SidebarProvider>
      </body>
    </html>
  );
}

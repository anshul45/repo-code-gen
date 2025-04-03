import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function BuildLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen">
      <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset className="flex-1">
        {children}
      </SidebarInset>
    </div>
  );
}

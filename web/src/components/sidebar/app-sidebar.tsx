"use client"

import * as React from "react"
import {
  Code,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navMain = [
    {
      title: "Build Micro App",
      url: "/",
      icon: ListIcon,
    },
    {
      title: "Create Landing Page",
      url: "/projects",
      icon: FolderIcon,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/" className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <span className="text-base font-semibold">Repo Code Gen.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="pl-2">
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={cn(
                  "group",
                  pathname === item.url
                    ? "bg-muted text-primary"
                    : "hover:bg-muted/50"
                )}
              >
                <a
                  href={item.url}
                  className="flex items-center gap-2 p-2 rounded-md"
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="/settings"
                className="flex items-center gap-2 p-2 rounded-md"
              >
                <LayoutDashboardIcon className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

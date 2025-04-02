"use client"

import type * as React from "react"
import { Code, LayoutIcon, LayoutDashboardIcon, ListIcon, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function AppSidebar({ variant = "inset", collapsible = "icon", ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const navMain = [
    {
      title: "Build Micro App",
      url: "/",
      icon: ListIcon,
    },
    {
      title: "Create Landing Page",
      url: "/create",
      icon: LayoutIcon,
    },
  ]

  return (
    <Sidebar variant={variant} collapsible={collapsible} {...props}>
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Code className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">DevStudio</span>
                  <span className="text-xs text-muted-foreground">Web Builder</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="pt-2">
        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={pathname === item.url}
                className={cn(
                  "my-1 transition-all duration-200",
                  pathname === item.url ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/80",
                )}
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center",
                      pathname === item.url ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                  </div>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarSeparator />

        <SidebarMenu className="pt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "my-1 transition-all duration-200",
                pathname === "/settings" ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/80",
              )}
              tooltip="Settings"
            >
              <Link href="/settings" className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center",
                    pathname === "/settings" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <LayoutDashboardIcon className="h-4 w-4" />
                </div>
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}
              className="my-1 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
              tooltip="Sign Out"
            >
              <div className="flex h-5 w-5 items-center justify-center text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </div>
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="my-2" />

        {/* Profile Section - Redesigned */}
        <div
          className={cn(
            "mx-2 mt-2 mb-4 overflow-hidden rounded-lg bg-muted/50 p-3 transition-all duration-200",
            isCollapsed ? "items-center justify-center" : "flex items-center gap-3",
          )}
        >
          <Avatar className={cn("border-2 border-background h-10 w-10 transition-all", isCollapsed ? "mx-auto" : "")}>
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium text-sm">{session?.user?.name || "User"}</span>
              <span className="truncate text-xs text-muted-foreground">
                {session?.user?.email || "user@example.com"}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

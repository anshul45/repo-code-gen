"use client";

import { useEffect, useState } from "react";
import type * as React from "react";
import {
  Code,
  LayoutIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Folder,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { getUserProjects, Project } from "@/services/project-api";

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
} from "@/components/ui/sidebar";

export function AppSidebar({
  variant = "inset",
  collapsible = "icon",
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navMain = [
    {
      title: "Build Micro App",
      url: "/",
      icon: ListIcon,
    },
    {
      title: "Create Landing Page",
      url: "/build/create",
      icon: LayoutIcon,
    },
  ];

  // Fetch user projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (session?.user) {
        try {
          // Using email as identifier since id property doesn't exist in the session user
          const userId = session.id;
          if (userId) {
            setIsLoading(true);
            const projectsData = await getUserProjects(userId);
            setProjects(projectsData);
          }
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (session?.user) {
      fetchProjects();
    } else {
      setIsLoading(false);
    }
  }, [session?.user]);

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
                  <span className="text-xs text-muted-foreground">
                    Web Builder
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Sidebar collapse toggle button */}
      <div className="px-3 py-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between" 
          onClick={toggleSidebar}
        >
          <span className={cn(!isCollapsed ? "block" : "hidden")}>
            Collapse Sidebar
          </span>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

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
                  pathname === item.url
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/80"
                )}
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center",
                      pathname === item.url
                        ? "text-primary"
                        : "text-muted-foreground"
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

        {/* User Projects Section */}
        <div className="mt-4">
          <div className={cn("px-3 pb-2", isCollapsed ? "text-center" : "")}>
            <h3 className={cn("text-sm font-medium text-muted-foreground", isCollapsed ? "hidden" : "")}>
              Your Projects
            </h3>
            {isCollapsed && <Folder className="h-4 w-4 mx-auto text-muted-foreground" />}
          </div>
          
          <SidebarMenu>
            {isLoading ? (
              // Show loading skeletons when loading
              Array(3).fill(0).map((_, i) => (
                <SidebarMenuItem key={`skeleton-${i}`}>
                  <div className={cn("px-3 py-2 my-1", isCollapsed ? "flex justify-center" : "")}>
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  </div>
                </SidebarMenuItem>
              ))
            ) : projects.length > 0 ? (
              // Show projects if available
              projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton
                    tooltip={project.name}
                    asChild
                    isActive={pathname === `/project/${project.id}`}
                    className={cn(
                      "my-1 transition-all duration-200",
                      pathname === `/project/${project.id}`
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/80"
                    )}
                  >
                    <Link href={`/project/${project.id}`} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center",
                          pathname === `/project/${project.id}`
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        <Folder className="h-4 w-4" />
                      </div>
                      <span className="truncate">{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              // Show empty state if no projects
              <SidebarMenuItem>
                <div className={cn("px-3 py-2 text-sm text-muted-foreground", isCollapsed ? "hidden" : "")}>
                  No projects found
                </div>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarSeparator />

        <SidebarMenu className="pt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "my-1 transition-all duration-200",
                pathname === "/settings"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80"
              )}
              tooltip="Settings"
            >
              <Link href="/settings" className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center",
                    pathname === "/settings"
                      ? "text-primary"
                      : "text-muted-foreground"
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
              onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
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
            isCollapsed
              ? "items-center justify-center"
              : "flex items-center gap-3"
          )}
        >
          <Avatar
            className={cn(
              "border-2 border-background h-10 w-10 transition-all",
              isCollapsed ? "mx-auto" : ""
            )}
          >
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || "User"}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium text-sm">
                {session?.user?.name || "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {session?.user?.email || "user@example.com"}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

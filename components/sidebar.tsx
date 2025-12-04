"use client";

import * as React from "react";
import {
  Calendar,
  CheckSquare,
  FileText,
  Home,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/teacher",
  },
  {
    title: "Assignments",
    icon: FileText,
    href: "/teacher/assignments",
  },
  {
    title: "Schedule",
    icon: Calendar,
    href: "/teacher/schedule",
  },
  {
    title: "Resources",
    icon: Video,
    href: "/teacher/resources",
  },
  {
    title: "Attendance",
    icon: CheckSquare,
    href: "/teacher/attendance",
  },
  {
    title: "Students",
    icon: Users,
    href: "/teacher/students",
  },
];


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/teacher" className="flex items-center gap-3">
                <div className="flex shrink-0 items-center justify-center">
                  <Image
                    src="/logo/tayog.svg"
                    alt="Tayog Logo"
                    width={32}
                    height={32}
                    className="group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
                  />
                </div>
                <span className="truncate font-semibold text-sm group-data-[collapsible=icon]:hidden">
                  Kalnet
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname?.startsWith(item.href + "/")}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                <p className="truncate font-semibold text-sm">John Doe</p>
                <p className="truncate text-xs text-muted-foreground">Teacher</p>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}


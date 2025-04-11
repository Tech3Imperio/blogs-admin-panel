"use client";

import { ScrollText, User, File } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { WebsiteDropdown } from "../Navbar/WebsiteDropdown";
import { Button } from "../ui/button";
import { signout } from "@/app/actions/auth";
import Link from "next/link";
// import { NewBlogDialog } from "@/app/dashboard/new-blog/NewBlogDialog";

const dashboardItems = [
  {
    title: "All Blogs",
    url: "/dashboard/all-blogs",
    icon: ScrollText,
  },
  {
    title: "Drafts",
    url: "/dashboard/drafts",
    icon: File,
  },
];

const settingsItems = [
  {
    title: "Profile",
    url: "/settings/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [activeSegment, setActiveSegment] = useState<string>("all-blogs");
  useEffect(() => {
    const currActiveSegment = pathname.split("/").filter(Boolean)[1];
    setActiveSegment(currActiveSegment);
  }, [pathname]);

  const getSegment = (url: string) => {
    return url.split("/").filter(Boolean)[1];
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <WebsiteDropdown />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup className="pt-4 pb-0 px-4">
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={
                    activeSegment === getSegment(item.url)
                      ? `bg-${theme} rounded-md`
                      : ""
                  }
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {/* )} */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pt-4 pb-0 px-4">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={
                    activeSegment === getSegment(item.url)
                      ? `bg-${theme} rounded-md`
                      : ""
                  }
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
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
      <SidebarFooter className="p-4">
        <Button variant="outline" onClick={signout} className="bg-transparent">
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

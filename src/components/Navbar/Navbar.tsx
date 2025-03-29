import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
// import { signout } from "../actions/auth";
// import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import NavBreadCrumb from "./NavBreadCrumb";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const Navbar = () => {
  return (
    <>
      <div className="flex flex-row items-center px-4 justify-between w-[100%]">
        <div className="flex flex-row justify-center items-center gap-4 h-min">
          <SidebarTrigger />
          <NavBreadCrumb />
        </div>
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Button
                asChild
                className="rounded-full !roboto-regular !gap-1 !pl-3 !text-[12px]"
              >
                <Link href={"/dashboard/new-blog"}>
                  <Plus className="!w-[14px] !h-[14px]" />
                  <span>New Blog</span>
                </Link>
              </Button>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};

export default Navbar;

"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/App-Sidebar";
import Navbar from "@/components/Navbar/Navbar";
// import { BlogType } from "@/models/blogs/Blog";
// import { getAllBlogs } from "@/lib/getBlogsData";
const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // useEffect(() => {
  //   async function fetchBlogs() {
  //     try {
  //       const blogsData: BlogType[] = await getAllBlogs();
  //       console.log(blogsData);
  //       localStorage.setItem("blogs", JSON.stringify(blogsData));
  //       console.log("set blogs");
  //     } catch (error) {
  //       console.error("Error Fetching Blogs", error);
  //     }
  //   }
  //   fetchBlogs();
  // }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col flex-grow">
        <div className="flex flex-row justify-center py-4 ">
          <Navbar />
        </div>
        <hr className="h-[1px] w-[100%]" />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;

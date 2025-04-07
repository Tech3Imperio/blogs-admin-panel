"use client";

import React from "react";
import BlogPreview from "@/components/NewBlog/BlogPreview";
import SectionsDataFields from "@/components/NewBlog/SectionsDataFields";
import SectionsNavBar from "@/components/NewBlog/SectionsNavBar";
import { useParams } from "next/navigation";
import { newBlog } from "@/state/proxies/newBlog";
import { BlogType } from "@/models/blogs/Blog";
import { Delta } from "quill";
import { activeSection } from "@/state/proxies/activeSection";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
const Blog = () => {
  const params = useParams();
  const blogSlug = params?.blogSlug;
  const blogs: BlogType[] = JSON.parse(localStorage.getItem("blogs") || "[]");

  const reset = () => {
    console.log("Params:", params);
    console.log("Blog Slug:", blogSlug);

    if (!blogSlug || !blogs) return; // Avoid running the effect if blogSlug is undefined

    const blog = blogs.find((blog) => blog.metadata.blogSlug === blogSlug);

    console.log("Found Blog:", blog);

    if (blog) {
      for (let i = 0; i < blog.sections.length; i++) {
        const section = blog.sections[i];
        for (let j = 0; j < section.subSections.length; j++) {
          const subSection = section.subSections[j];
          if (subSection.name === "Heading") {
            subSection.heading = new Delta(subSection.heading);
          } else if (subSection.name === "Body") {
            subSection.body = new Delta(subSection.body);
          } else if (subSection.name === "SubHeading") {
            subSection.subHeading = new Delta(subSection.subHeading);
          }
        }
      }
      const resetNewBlog = () => {
        newBlog.metadata = { ...blog.metadata };
        newBlog.sections = [...blog.sections];
        newBlog.isDraft = blog.isDraft;
      };
      const resetActiveSection = () => {
        activeSection.name = "Metadata";
        activeSection.index = -1;
      };
      resetActiveSection();
      resetNewBlog();

      console.log("Blog state updated", newBlog);
    }
  };
  reset();
  return (
    <div className="flex flex-row justify-stretch h-[100%]">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <SectionsNavBar />
        <ResizablePanel className=" min-w-[20%]" defaultSize={30}>
          <SectionsDataFields />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="min-w-[40%] h-full" defaultSize={57.5}>
          <BlogPreview />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Blog;

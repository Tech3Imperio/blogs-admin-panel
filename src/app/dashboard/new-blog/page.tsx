"use client";

import React, { useEffect, useState } from "react";
import BlogPreview from "@/components/NewBlog/BlogPreview";
import SectionsDataFields from "@/components/NewBlog/SectionsDataFields";
import SectionsNavBar from "@/components/NewBlog/SectionsNavBar";
import { NewBlogDialog } from "./NewBlogDialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const NewBlog = () => {
  const [isSlugValid, setIsSlugValid] = useState(false);

  useEffect(() => {
    // Force the dialog to appear when the page loads
    setIsSlugValid(false);
  }, []);
  return (
    <div className="flex flex-row justify-stretch h-[100%]">
      {!isSlugValid ? (
        <NewBlogDialog onValidSlug={() => setIsSlugValid(true)} />
      ) : (
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
      )}
    </div>
  );
};

export default NewBlog;

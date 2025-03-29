"use client";

import React, { useEffect, useState } from "react";
import BlogPreview from "@/components/NewBlog/BlogPreview";
import SectionsDataFields from "@/components/NewBlog/SectionsDataFields";
import SectionsNavBar from "@/components/NewBlog/SectionsNavBar";
import { NewBlogDialog } from "./NewBlogDialog";

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
        <>
          <SectionsNavBar />
          <SectionsDataFields />
          <BlogPreview />
        </>
      )}
    </div>
  );
};

export default NewBlog;

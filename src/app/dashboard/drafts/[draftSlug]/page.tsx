"use client";

import React, { useLayoutEffect, useState } from "react";
import BlogPreview from "@/components/NewBlog/BlogPreview";
import SectionsDataFields from "@/components/NewBlog/SectionsDataFields";
import SectionsNavBar from "@/components/NewBlog/SectionsNavBar";
import { useParams } from "next/navigation";
import { newBlog } from "@/state/proxies/newBlog";
import { BlogType } from "@/models/blogs/Blog";
import { Delta } from "quill";
import { activeSection } from "@/state/proxies/activeSection";
const Draft = () => {
  const params = useParams();
  const draftSlug = params?.draftSlug;
  const blogs: BlogType[] = JSON.parse(localStorage.getItem("blogs") || "[]");
  const [loaded, setLoaded] = useState(false);
  useLayoutEffect(() => {
    if (!draftSlug || !blogs) return; // Avoid running the effect if blogSlug is undefined

    const draft = blogs.find((blog) => blog.metadata.blogSlug === draftSlug);

    if (draft) {
      for (let i = 0; i < draft.sections.length; i++) {
        const section = draft.sections[i];
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
      newBlog.metadata = draft.metadata;
      newBlog.sections = draft.sections;
      newBlog.isDraft = draft.isDraft;
      activeSection.name = "Metadata";
      activeSection.index = -1;
      setLoaded(true); // Force re-render
    }
  }, [blogs, draftSlug, params]);

  if (!loaded) return <p>Loading...</p>; // Prevent rendering empty state

  return (
    <div className="flex flex-row justify-stretch h-[100%]">
      <SectionsNavBar />
      <SectionsDataFields />
      <BlogPreview />
    </div>
  );
};

export default Draft;

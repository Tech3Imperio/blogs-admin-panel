"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSnapshot } from "@/lib/valtio";
import { newBlog } from "@/state/proxies/newBlog";
import ImageCarouselPreview from "./PreviewComponents/ImageCarouselPreview";
import HeadingPreview from "./PreviewComponents/HeadingPreview";
import BodyPreview from "./PreviewComponents/BodyPreview";
import MetadataPreview from "./PreviewComponents/MetadataPreview";
import { Delta } from "quill";
import { BlogMetadataProtocol } from "@/models/blogs/metadata/BlogMetadata";
import { SectionProtocol } from "@/models/blogs/sections/BlogSection";
import ValidationAlert from "./PreviewComponents/ValidationAlert";
import { submitBlog } from "@/app/actions/submitBlog";
import SubHeadingPreview from "./PreviewComponents/SubHeadingPreview";
import { saveDraft } from "@/app/actions/saveDraft";
import { BlogType } from "@/models/blogs/Blog";
import _ from "lodash";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { useRouter } from "next/navigation";
import { blogSubmitted } from "@/state/proxies/blogSubmitted";
import { useToast } from "@/hooks/use-toast";
const BlogPreview = () => {
  const router = useRouter();
  const blogSnap = useSnapshot(newBlog);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [savedData, setSavedData] = useState<BlogType>(_.cloneDeep(newBlog));
  const sections = blogSnap.sections;
  const metadata = blogSnap.metadata;
  const closeAlert = () => {
    setHasError(!hasError);
  };
  useEffect(() => {
    const hasChanges = !_.isEqual(savedData, blogSnap);
    if (hasChanges && isDisabled) {
      setIsDisabled(!isDisabled);
    }
  }, [blogSnap, savedData, isDisabled]); // Depend on reactive proxy
  useUnsavedChangesWarning({ isDisabled });
  const { toast } = useToast();
  return (
    <div className="flex flex-col w-full px-4 py-4 gap-4 bg-gray-50 h-full">
      {hasError && <ValidationAlert closeAlert={closeAlert} />}
      <div className="flex flex-row justify-between items-end w-[100%] h-max">
        <div className="flex items-center text-[14px] h-[32px] text-[#3f3f46B5]">
          Preview
        </div>
        <div className="flex flex-row justify-center gap-2 w-max">
          {/* <Button size="sm" variant="outline">
            Cancel
          </Button> */}
          <Button
            id="save-button"
            className={`${
              isDisabled
                ? "bg-slate-500 hover:bg-slate-500 cursor-not-allowed"
                : ""
            }`}
            size="sm"
            onClick={async () => {
              if (isDisabled) {
                console.log("Nothing to save");
                return;
              }

              const metadataResponse = BlogMetadataProtocol.safeParse(
                newBlog.metadata
              );
              if (!metadataResponse.success) {
                setHasError(!hasError);
                console.log("Metadata Error", metadataResponse.error.issues);
                return;
              }
              for (let i = 0; i < newBlog.sections.length; i++) {
                const sectionResponse = SectionProtocol.safeParse(
                  newBlog.sections[i]
                );
                if (!sectionResponse.success) {
                  setHasError(!hasError);
                  console.log("Section Error", sectionResponse.error?.issues);
                  console.log("Error in", newBlog.sections[i].name);
                  return;
                }
              }
              setIsDisabled(!isDisabled);
              setSavedData(_.cloneDeep(newBlog));
              const draft = JSON.parse(JSON.stringify(newBlog));
              const status = await saveDraft(draft);
              if (status.success) {
                const blogsData = status.blogs;
                localStorage.setItem("blogs", JSON.stringify(blogsData));
                toast({
                  duration: 3000,
                  title: status.message,
                });
                console.log("Draft Submitted", draft);
              } else {
                toast({
                  variant: "destructive",
                  duration: 3000,
                  title: status.message,
                });
              }
            }}
          >
            {newBlog.isDraft ? "Save Draft" : "Update"}
          </Button>
          {newBlog.isDraft ? (
            <Button
              size="sm"
              onClick={async () => {
                blogSubmitted.status = true;
                const metadataResponse = BlogMetadataProtocol.safeParse(
                  newBlog.metadata
                );
                if (!metadataResponse.success) {
                  setHasError(!hasError);
                  console.log("Metadata Error", metadataResponse.error.issues);
                  return;
                }
                for (let i = 0; i < newBlog.sections.length; i++) {
                  const sectionResponse = SectionProtocol.safeParse(
                    newBlog.sections[i]
                  );
                  if (!sectionResponse.success) {
                    setHasError(!hasError);
                    console.log("Section Error", sectionResponse.error?.issues);
                    console.log("Error in", newBlog.sections[i].name);
                    return;
                  }
                }
                if (newBlog.isDraft) {
                  newBlog.isDraft = false;
                }
                const plainBlog: BlogType = JSON.parse(JSON.stringify(newBlog));
                const status = await submitBlog(plainBlog);
                if (status.success) {
                  const blogsData = status.blogs;
                  localStorage.setItem("blogs", JSON.stringify(blogsData));
                  console.log("Blog Submitted", plainBlog);
                  toast({
                    duration: 3000,
                    title: status.message,
                  });
                  router.push(
                    `/dashboard/all-blogs/${plainBlog.metadata.blogSlug}`
                  );
                  blogSubmitted.status = false;
                } else {
                  newBlog.isDraft = true;
                  toast({
                    variant: "destructive",
                    duration: 3000,
                    title: status.message,
                  });
                }
                console.log(status.message, status.error);
              }}
            >
              Submit
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        id="testing"
        className="flex flex-col w-full gap-4 justify-start items-center bg-white rounded-lg h-full overflow-hidden overflow-y-scroll max-h-[842px] scrollbar-none shadow-inner"
      >
        <MetadataPreview metadata={metadata} />
        {sections.map((section, index) => {
          return (
            <div
              key={index}
              id={`${section.sectionId}`}
              className="flex flex-col gap-4 px-32 py-0 mt-4 justify-start items-start w-[100%]"
            >
              {section.subSections.map((subSection, index) => {
                if (subSection.name === "Heading") {
                  return (
                    <HeadingPreview
                      key={index}
                      subSection={{
                        ...subSection,
                        heading: subSection.heading as Delta,
                      }}
                    />
                  );
                } else if (subSection.name === "Body") {
                  return (
                    <BodyPreview
                      key={index}
                      subSection={{
                        ...subSection,
                        body: subSection.body as Delta,
                        bodyImages: subSection.bodyImages
                          ? {
                              ...subSection.bodyImages,
                              images: subSection.bodyImages.images.map(
                                (img) => ({
                                  src: img.src,
                                  altText: img.altText,
                                })
                              ), // Convert readonly array to a mutable one
                            }
                          : null,
                      }}
                    />
                  );
                } else if (subSection.name === "ImageCarousel") {
                  return (
                    <ImageCarouselPreview
                      key={index}
                      bodyImages={false}
                      images={subSection.images.map((img) => ({ ...img }))} // Convert to mutable array
                    />
                  );
                } else if (subSection.name === "SubHeading") {
                  return (
                    <SubHeadingPreview
                      key={index}
                      subSection={{
                        ...subSection,
                        subHeading: subSection.subHeading as Delta,
                      }}
                    />
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogPreview;

{
  /* <pre className="text-left text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(blogSnap, null, 2)}
        </pre> */
}

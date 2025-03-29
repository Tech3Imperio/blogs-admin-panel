"use client";

import {
  Card,
  // CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { BlogType } from "@/models/blogs/Blog";
import { getAllBlogs } from "@/lib/getBlogsData";
import { useLayoutEffect, useState } from "react";
import { DeleteBlog } from "@/components/DeleteBlog";
const AllBlogs = () => {
  const [drafts, setDrafts] = useState<BlogType[]>([]);
  useLayoutEffect(() => {
    async function fetchBlogs() {
      try {
        const blogsData: BlogType[] = await getAllBlogs();
        localStorage.setItem("blogs", JSON.stringify(blogsData));
        setDrafts(() => JSON.parse(localStorage.getItem("blogs") || "[]"));
      } catch (error) {
        console.error("Error Fetching Blogs", error);
      }
    }
    fetchBlogs();
  }, []);
  const editDraft = (draftSlug: string) => {
    redirect(`/dashboard/drafts/${draftSlug}`);
  };
  console.log("This log", drafts);
  if (!drafts) return <p>Loading...</p>;
  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      {drafts.map((draft, index) => {
        if (draft.isDraft) {
          return (
            <Card key={index} className="w-full h-[180px]">
              <div className="flex flex-row gap-6 justify-center items-center rounded-md overflow-hidden w-full h-full">
                <Image
                  className="h-full w-auto aspect-square object-cover rounded-md"
                  width={400}
                  height={400}
                  priority
                  src={draft.metadata.image.src}
                  alt={draft.metadata.image.src}
                />
                <div className="w-full py-2 pr-6 gap-3 flex flex-col items-start justify-center">
                  <CardHeader className="p-0 ">
                    <CardTitle className="text-[20px] font-medium din-medium tracking-wide">
                      {draft.metadata.title}
                    </CardTitle>
                    <CardDescription className="font-[12px] roboto-regular">
                      {draft.metadata.description}
                    </CardDescription>
                  </CardHeader>
                  {/* <CardContent className="font-[12px] p-0">
                  <p>Card Content</p>
                </CardContent> */}
                  <CardFooter className="text-[14px] p-0 gap-2 flex flex-row justify-start w-full">
                    <DeleteBlog blogSlug={draft.metadata.blogSlug} />
                    <Button
                      onClick={() => {
                        editDraft(draft.metadata.blogSlug);
                      }}
                      variant="default"
                      size="sm"
                      className="rounded-full roboto-regular !gap-1 pl-4"
                    >
                      Edit
                      <ChevronRight className="!w-[14px] !h-[14px]" />
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          );
        }
      })}
    </div>
  );
};

export default AllBlogs;

"use client";
export const dynamic = "force-dynamic";
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
import { Badge } from "@/components/ui/badge";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  useLayoutEffect(() => {
    async function fetchBlogs() {
      try {
        const blogsData: BlogType[] = await getAllBlogs();
        localStorage.setItem("blogs", JSON.stringify(blogsData));
        setBlogs(() => JSON.parse(localStorage.getItem("blogs") || "[]"));
      } catch (error) {
        console.error("Error Fetching Blogs", error);
      }
    }
    fetchBlogs();
  }, []);
  const editBlog = (blogSlug: string) => {
    redirect(`/dashboard/all-blogs/${blogSlug}`);
  };

  console.log("This log", blogs);
  if (!blogs) return <p>Loading...</p>;
  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      {blogs.map((blog, index) => {
        if (!blog.isDraft) {
          return (
            <Card
              key={index}
              className="w-full h-[200px]  border-none"
              style={{
                boxShadow: "rgba(99, 99, 99, 0.1) 0px 2px 8px 0px",
              }}
            >
              <div className="flex flex-row gap-6 justify-center items-center rounded-md overflow-hidden w-full h-full">
                <Image
                  className="h-full w-auto aspect-square object-cover rounded-xl"
                  width={400}
                  height={400}
                  priority
                  src={blog.metadata.image.src}
                  alt={blog.metadata.image.src}
                />
                <div className="w-full py-2 pr-6 gap-3 flex flex-col items-start justify-center">
                  <CardHeader className="p-0 ">
                    <Badge className="w-max rounded-full bg-gray-500">
                      <i className="font-extralight tracking-wider">
                        /{blog.metadata.blogSlug}
                      </i>
                    </Badge>
                    <CardTitle className="text-[20px] font-medium din-medium tracking-wide">
                      {blog.metadata.title}
                    </CardTitle>
                    <CardDescription className="font-[12px] roboto-regular w-full overflow-clip">
                      {blog.metadata.description}
                    </CardDescription>
                  </CardHeader>
                  {/* <CardContent className="font-[12px] p-0">
                  <p>Card Content</p>
                </CardContent> */}
                  <CardFooter className="text-[14px] p-0 flex gap-2 flex-row justify-start w-full">
                    <DeleteBlog blogSlug={blog.metadata.blogSlug} />
                    <Button
                      onClick={() => {
                        editBlog(blog.metadata.blogSlug);
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

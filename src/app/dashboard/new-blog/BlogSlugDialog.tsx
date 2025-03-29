"use client"; // ✅ Ensure this is a Client Component

"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { newBlog } from "@/state/proxies/newBlog";
import { Delta } from "quill";
import { v4 as uuid } from "uuid";
import { activeSection } from "@/state/proxies/activeSection";
import { BlogSlugProtocol } from "@/models/blogs/metadata/BlogMetadata";

interface BlogSlugDialogProps {
  show: boolean;
  onConfirm: () => void;
}

const BlogSlugDialog: React.FC<BlogSlugDialogProps> = ({ show, onConfirm }) => {
  const form = useForm<z.infer<typeof BlogSlugProtocol>>({
    resolver: zodResolver(BlogSlugProtocol),
    mode: "onBlur",
    defaultValues: {
      blogSlug: "",
    },
  });

  const [blogSlug, setBlogSlug] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (blogSlug: string) => {
    setBlogSlug(blogSlug);
  };

  const createNewBlog = (blogSlug: string) => {
    const resetNewBlog = () => {
      newBlog.isDraft = true;
      newBlog.metadata = {
        title: "",
        description: "",
        image: {
          src: "",
          alt: "",
        },
        blogSlug: blogSlug,
      };
      newBlog.sections = [
        {
          name: "Section 1",
          sectionId: uuid(),
          subSections: [
            {
              name: "Heading",
              heading: new Delta().insert("Heading"),
            },
            {
              name: "Body",
              body: new Delta().insert("Body"),
              hasImages: false,
              bodyImages: null,
            },
          ],
        },
      ];
    };

    const resetActiveSection = () => {
      activeSection.name = "Metadata";
      activeSection.index = -1;
    };

    resetActiveSection();
    resetNewBlog();
    setTimeout(() => {
      router.push("/dashboard/new-blog");
    }, 100);
  };
  const handleConfirm = async () => {
    const isOk = await form.trigger("blogSlug");

    if (isOk) {
      createNewBlog(blogSlug);
      form.reset();
      setIsOpen(false); // Close dialog only if valid
    }
  };
  return (
    <Dialog open={show}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-medium">Blog Slug</DialogTitle>
          <DialogDescription>Please Specify Blog Slug</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-1">
            <FormField
              control={form.control}
              name="blogSlug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="items-center gap-4 mt-2">
                      <Input
                        placeholder="kebab-cased-blog-slug"
                        type="text"
                        {...field}
                        onBlur={async (e) => {
                          const isOk = await form.trigger("blogSlug");
                          if (isOk) {
                            handleChange(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <div className="min-h-4 px-1 !mt-1">
                    <FormMessage className="text-[12px] m-0" />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="!justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                form.reset();
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            size="sm"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogSlugDialog;
